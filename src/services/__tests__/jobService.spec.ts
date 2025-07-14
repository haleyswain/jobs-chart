import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getJobDescriptions, type JobDescription } from '../jobService';
import * as api from '../api';
import type { JobApiResponse } from '../api';

interface MalformedApiResponse {
  data: {
    searches: null;
  };
  status: number;
}
interface IncompleteApiResponse {
  data: Record<string, unknown>;
  status: number;
}

vi.mock('../api');

describe('jobService', () => {
  const mockGetJobData = vi.mocked(api.getJobData);

  beforeEach(() => {
    mockGetJobData.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getJobDescriptions', () => {
    const mockJobData: JobDescription[] = [
      {
        websiteTitle: 'Software Engineer',
        websiteOrganization: 'Tech Corp',
        websiteLocation: 'San Francisco, CA',
        websiteDatePublished: '2024-01-15'
      },
      {
        websiteTitle: 'Frontend Developer',
        websiteOrganization: 'Startup Inc',
        websiteLocation: 'New York, NY',
        websiteDatePublished: '2024-02-20'
      },
      {
        websiteTitle: 'Full Stack Developer',
        websiteOrganization: 'Innovation Labs',
        websiteLocation: 'Austin, TX',
        websiteDatePublished: '2024-03-10'
      }
    ];

    const mockApiResponse = {
      data: {
        searches: mockJobData
      },
      status: 200
    };

    it('should return job descriptions when called without query parameter', async () => {
      mockGetJobData.mockResolvedValue(mockApiResponse);

      const result = await getJobDescriptions();

      expect(mockGetJobData).toHaveBeenCalledWith('', undefined);
      expect(result).toEqual(mockJobData);
    });

    it('should return job descriptions when called with query parameter', async () => {
      mockGetJobData.mockResolvedValue(mockApiResponse);

      const query = 'javascript developer';
      const result = await getJobDescriptions(query);

      expect(mockGetJobData).toHaveBeenCalledWith('', { q: query });
      expect(result).toEqual(mockJobData);
    });

    it('should handle undefined query parameter', async () => {
      mockGetJobData.mockResolvedValue(mockApiResponse);

      const result = await getJobDescriptions(undefined);

      expect(mockGetJobData).toHaveBeenCalledWith('', undefined);
      expect(result).toEqual(mockJobData);
    });

    it('should return empty array when API returns empty searches', async () => {
      const emptyResponse = {
        data: {
          searches: []
        },
        status: 200
      };
      mockGetJobData.mockResolvedValue(emptyResponse);

      const result = await getJobDescriptions('nonexistent job');

      expect(mockGetJobData).toHaveBeenCalledWith('', { q: 'nonexistent job' });
      expect(result).toEqual([]);
    });

    it('should handle network errors from getJobData', async () => {
      const networkError = new Error('Network error - please check your connection');
      mockGetJobData.mockRejectedValue(networkError);

      await expect(getJobDescriptions('test query')).rejects.toThrow('Network error - please check your connection');
      expect(mockGetJobData).toHaveBeenCalledWith('', { q: 'test query' });
    });

    it('should handle HTTP errors from getJobData', async () => {
      const httpError = new Error('HTTP 404: Not Found');
      mockGetJobData.mockRejectedValue(httpError);

      await expect(getJobDescriptions()).rejects.toThrow('HTTP 404: Not Found');
      expect(mockGetJobData).toHaveBeenCalledWith('', undefined);
    });

    it('should handle server errors from getJobData', async () => {
      const serverError = new Error('HTTP 500: Internal Server Error');
      mockGetJobData.mockRejectedValue(serverError);

      await expect(getJobDescriptions('test')).rejects.toThrow('HTTP 500: Internal Server Error');
      expect(mockGetJobData).toHaveBeenCalledWith('', { q: 'test' });
    });

    it('should handle malformed API response', async () => {
      const malformedResponse: MalformedApiResponse = {
        data: {
          searches: null
        },
        status: 200
      };
      mockGetJobData.mockResolvedValue(malformedResponse as unknown as JobApiResponse);

      const result = await getJobDescriptions();

      expect(result).toBeNull();
    });

    it('should handle missing data.searches property', async () => {
      const incompleteResponse: IncompleteApiResponse = {
        data: {}, // Empty object without searches property
        status: 200
      };
      mockGetJobData.mockResolvedValue(incompleteResponse as unknown as JobApiResponse);

      const result = await getJobDescriptions();

      expect(result).toBeUndefined();
    });
  });

  describe('Type exports', () => {
    it('should export JobDescription type correctly', () => {
      const jobDescription: JobDescription = {
        websiteTitle: 'Test Job',
        websiteOrganization: 'Test Organization',
        websiteLocation: 'Test Location',
        websiteDatePublished: '2024-01-01'
      };

      expect(jobDescription).toHaveProperty('websiteTitle');
      expect(jobDescription).toHaveProperty('websiteOrganization');
      expect(jobDescription).toHaveProperty('websiteLocation');
      expect(jobDescription).toHaveProperty('websiteDatePublished');
    });
  });
}); 