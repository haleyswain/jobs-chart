import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import JobDetailsTable from '../JobDetailsTable.vue';
import type { JobDescription } from '../../services/jobService';

describe('JobDetailsTable.vue', () => {
  const mockJobDescriptions: JobDescription[] = [
    {
      websiteTitle: 'Frontend Developer',
      websiteOrganization: 'Tech Corp',
      websiteLocation: 'San Francisco, CA',
      websiteDatePublished: '2024-01-15'
    },
    {
      websiteTitle: 'Backend Engineer',
      websiteOrganization: 'StartupInc',
      websiteLocation: 'New York, NY',
      websiteDatePublished: '2024-01-20'
    },
    {
      websiteTitle: 'Full Stack Developer',
      websiteOrganization: 'WebCorp',
      websiteLocation: 'Austin, TX',
      websiteDatePublished: '2024-02-10'
    }
  ];

  describe('Component Rendering', () => {
    it('should render table when selectedJobs is not empty', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: mockJobDescriptions,
          selectedMonth: 0
        }
      });

      expect(wrapper.find('.job-details-table').exists()).toBe(true);
      expect(wrapper.find('.jobs-table').exists()).toBe(true);
      expect(wrapper.find('h3').text()).toBe('Job Details for January');
    });

    it('should not render table when selectedJobs is empty', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: [],
          selectedMonth: 0
        }
      });

      expect(wrapper.find('.job-details-table').exists()).toBe(false);
    });

    it('should render correct number of job rows', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: mockJobDescriptions,
          selectedMonth: 0
        }
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(3);
    });

    it('should render table headers correctly', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: mockJobDescriptions,
          selectedMonth: 0
        }
      });

      const headers = wrapper.findAll('th');
      expect(headers).toHaveLength(4);
      expect(headers[0].text()).toBe('Title');
      expect(headers[1].text()).toBe('Organization');
      expect(headers[2].text()).toBe('Location');
      expect(headers[3].text()).toBe('Date Published');
    });
  });

  describe('Job Data Display', () => {
    it('should display job information correctly', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: [mockJobDescriptions[0]],
          selectedMonth: 0
        }
      });

      const firstRow = wrapper.find('tbody tr');
      const cells = firstRow.findAll('td');
      
      expect(cells[0].text()).toBe('Frontend Developer');
      expect(cells[1].text()).toBe('Tech Corp');
      expect(cells[2].text()).toBe('San Francisco, CA');
      expect(cells[3].text()).toBe('Jan 15, 2024');
    });

    it('should handle multiple jobs correctly', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: mockJobDescriptions.slice(0, 2),
          selectedMonth: 0
        }
      });

      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(2);
      
      const firstRowCells = rows[0].findAll('td');
      expect(firstRowCells[0].text()).toBe('Frontend Developer');
      expect(firstRowCells[1].text()).toBe('Tech Corp');
      
      const secondRowCells = rows[1].findAll('td');
      expect(secondRowCells[0].text()).toBe('Backend Engineer');
      expect(secondRowCells[1].text()).toBe('StartupInc');
    });
  });

  describe('Month Name Display', () => {
    it('should display correct month name for each month', () => {
      const monthTestCases = [
        { month: 0, expected: 'January' },
        { month: 1, expected: 'February' },
        { month: 2, expected: 'March' },
        { month: 11, expected: 'December' }
      ];

      monthTestCases.forEach(({ month, expected }) => {
        const wrapper = shallowMount(JobDetailsTable, {
          props: {
            selectedJobs: [mockJobDescriptions[0]],
            selectedMonth: month
          }
        });

        expect(wrapper.find('h3').text()).toBe(`Job Details for ${expected}`);
      });
    });

    it('should handle null selectedMonth', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: [mockJobDescriptions[0]],
          selectedMonth: null
        }
      });

      expect(wrapper.find('h3').text()).toBe('Job Details for');
    });
  });

  describe('Date Formatting', () => {
    it('should format dates correctly', () => {
      const jobWithDate = {
        websiteTitle: 'Test Job',
        websiteOrganization: 'Test Corp',
        websiteLocation: 'Test City',
        websiteDatePublished: '2024-03-15'
      };

      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: [jobWithDate],
          selectedMonth: 2
        }
      });

      const dateCell = wrapper.find('tbody tr td:nth-child(4)');
      expect(dateCell.text()).toBe('Mar 15, 2024');
    });

    it('should handle invalid dates gracefully', () => {
      const jobWithInvalidDate = {
        websiteTitle: 'Test Job',
        websiteOrganization: 'Test Corp',
        websiteLocation: 'Test City',
        websiteDatePublished: 'invalid-date'
      };

      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: [jobWithInvalidDate],
          selectedMonth: 0
        }
      });

      const dateCell = wrapper.find('tbody tr td:nth-child(4)');
      expect(dateCell.text()).toBe('invalid-date');
    });
  });

  describe('Component Props', () => {
    it('should accept selectedJobs prop', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: mockJobDescriptions,
          selectedMonth: 0
        }
      });

      expect(wrapper.props('selectedJobs')).toEqual(mockJobDescriptions);
    });

    it('should accept selectedMonth prop', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: mockJobDescriptions,
          selectedMonth: 5
        }
      });

      expect(wrapper.props('selectedMonth')).toBe(5);
    });

    it('should accept null selectedMonth', () => {
      const wrapper = shallowMount(JobDetailsTable, {
        props: {
          selectedJobs: mockJobDescriptions,
          selectedMonth: null
        }
      });

      expect(wrapper.props('selectedMonth')).toBe(null);
    });
  });
}); 