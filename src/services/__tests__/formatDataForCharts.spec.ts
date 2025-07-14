import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { processJobDataForChart } from '../formatDataForChart';
import type { JobDescription } from '../api';

describe('processJobDataForChart', () => {
  const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return chart data with all 12 months initialized to 0 for empty input', () => {
    const result = processJobDataForChart([]);
    
    expect(result.labels).toEqual([
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].label).toBe('Number of Job Descriptions');
    expect(result.datasets[0].backgroundColor).toBe('#42b983');
    expect(result.datasets[0].data).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('should correctly count jobs by month for valid dates', () => {
    const jobData: JobDescription[] = [
      {
        websiteTitle: 'Job 1',
        websiteOrganization: 'Company A',
        websiteLocation: 'Location 1',
        websiteDatePublished: '2023-01-15'
      },
      {
        websiteTitle: 'Job 2',
        websiteOrganization: 'Company B',
        websiteLocation: 'Location 2',
        websiteDatePublished: '2023-03-20'
      },
      {
        websiteTitle: 'Job 3',
        websiteOrganization: 'Company C',
        websiteLocation: 'Location 3',
        websiteDatePublished: '2023-01-25'
      }
    ];

    const result = processJobDataForChart(jobData);

    expect(result.datasets[0].data[0]).toBe(2);
    expect(result.datasets[0].data[1]).toBe(0);
    expect(result.datasets[0].data[2]).toBe(1);
    expect(result.datasets[0].data[3]).toBe(0);
    expect(result.datasets[0].data[4]).toBe(0);
    expect(result.datasets[0].data[5]).toBe(0);
    expect(result.datasets[0].data[6]).toBe(0); 
    expect(result.datasets[0].data[7]).toBe(0);
    expect(result.datasets[0].data[8]).toBe(0);
    expect(result.datasets[0].data[9]).toBe(0);
    expect(result.datasets[0].data[10]).toBe(0);
    expect(result.datasets[0].data[11]).toBe(0);
  });

  it('should handle jobs spread across different months', () => {
    const jobData: JobDescription[] = [
      {
        websiteTitle: 'Job 1',
        websiteOrganization: 'Company A',
        websiteLocation: 'Location 1',
        websiteDatePublished: '2023-06-15'
      },
      {
        websiteTitle: 'Job 2',
        websiteOrganization: 'Company B',
        websiteLocation: 'Location 2',
        websiteDatePublished: '2023-12-20'
      },
      {
        websiteTitle: 'Job 3',
        websiteOrganization: 'Company C',
        websiteLocation: 'Location 3',
        websiteDatePublished: '2023-09-10'
      }
    ];

    const result = processJobDataForChart(jobData);
    
    expect(result.datasets[0].data[5]).toBe(1);
    expect(result.datasets[0].data[8]).toBe(1);
    expect(result.datasets[0].data[11]).toBe(1);
  });

  it('should handle multiple jobs in the same month', () => {
    const jobData: JobDescription[] = [
      {
        websiteTitle: 'Job 1',
        websiteOrganization: 'Company A',
        websiteLocation: 'Location 1',
        websiteDatePublished: '2023-05-01'
      },
      {
        websiteTitle: 'Job 2',
        websiteOrganization: 'Company B',
        websiteLocation: 'Location 2',
        websiteDatePublished: '2023-05-15'
      },
      {
        websiteTitle: 'Job 3',
        websiteOrganization: 'Company C',
        websiteLocation: 'Location 3',
        websiteDatePublished: '2023-05-31'
      }
    ];

    const result = processJobDataForChart(jobData);
    
    expect(result.datasets[0].data[4]).toBe(3);
    expect((result.datasets[0].data as number[]).reduce((sum, count) => sum + count, 0)).toBe(3);
  });

  it('should handle invalid dates gracefully and log errors', () => {
    const jobData: JobDescription[] = [
      {
        websiteTitle: 'Job 1',
        websiteOrganization: 'Company A',
        websiteLocation: 'Location 1',
        websiteDatePublished: 'invalid-date'
      },
      {
        websiteTitle: 'Job 2',
        websiteOrganization: 'Company B',
        websiteLocation: 'Location 2',
        websiteDatePublished: '2023-02-15'
      }
    ];

    const result = processJobDataForChart(jobData);
    
    expect(result.datasets[0].data[1]).toBe(1); // February
    expect((result.datasets[0].data as number[]).reduce((sum, count) => sum + count, 0)).toBe(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Error parsing date:", 
      "invalid-date", 
      expect.any(Error)
    );
  });

  it('should handle empty string dates', () => {
    const jobData: JobDescription[] = [
      {
        websiteTitle: 'Job 1',
        websiteOrganization: 'Company A',
        websiteLocation: 'Location 1',
        websiteDatePublished: ''
      },
      {
        websiteTitle: 'Job 2',
        websiteOrganization: 'Company B',
        websiteLocation: 'Location 2',
        websiteDatePublished: '2023-07-10'
      }
    ];

    const result = processJobDataForChart(jobData);
    
    expect(result.datasets[0].data[6]).toBe(1);
    expect((result.datasets[0].data as number[]).reduce((sum, count) => sum + count, 0)).toBe(1);
  });

  it('should handle malformed date strings', () => {
    const jobData: JobDescription[] = [
      {
        websiteTitle: 'Job 1',
        websiteOrganization: 'Company A',
        websiteLocation: 'Location 1',
        websiteDatePublished: '2023-13-45'
      },
      {
        websiteTitle: 'Job 2',
        websiteOrganization: 'Company B',
        websiteLocation: 'Location 2',
        websiteDatePublished: 'not-a-date'
      },
      {
        websiteTitle: 'Job 3',
        websiteOrganization: 'Company C',
        websiteLocation: 'Location 3',
        websiteDatePublished: '2023-08-15'
      }
    ];

    const result = processJobDataForChart(jobData);
    
    expect(result.datasets[0].data[7]).toBe(1);
    expect((result.datasets[0].data as number[]).reduce((sum, count) => sum + count, 0)).toBe(1);
    expect(mockConsoleError).toHaveBeenCalledTimes(2);
  });

  it('should handle jobs from different years correctly', () => {
    const jobData: JobDescription[] = [
      {
        websiteTitle: 'Job 1',
        websiteOrganization: 'Company A',
        websiteLocation: 'Location 1',
        websiteDatePublished: '2022-03-15'
      },
      {
        websiteTitle: 'Job 2',
        websiteOrganization: 'Company B',
        websiteLocation: 'Location 2',
        websiteDatePublished: '2023-03-20'
      },
      {
        websiteTitle: 'Job 3',
        websiteOrganization: 'Company C',
        websiteLocation: 'Location 3',
        websiteDatePublished: '2024-03-25'
      }
    ];

    const result = processJobDataForChart(jobData);
    
    expect(result.datasets[0].data[2]).toBe(3); // March (all three jobs)
    expect((result.datasets[0].data as number[]).reduce((sum, count) => sum + count, 0)).toBe(3);
  });

  it('should return correct structure with proper labels and dataset configuration', () => {
    const result = processJobDataForChart([]);
    
    expect(result).toHaveProperty('labels');
    expect(result).toHaveProperty('datasets');
    expect(result.labels).toHaveLength(12);
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0]).toHaveProperty('label', 'Number of Job Descriptions');
    expect(result.datasets[0]).toHaveProperty('backgroundColor', '#42b983');
    expect(result.datasets[0]).toHaveProperty('data');
    expect(result.datasets[0].data).toHaveLength(12);
  });
});
