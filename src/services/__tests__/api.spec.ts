import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getJobData, type JobDescription, type JobApiResponse } from '../api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.stubGlobal('import.meta', {
  env: {
    VITE_API_BASE_URL: '/api'
  }
});

describe('api.ts', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getJobData', () => {
    const mockJobData: JobDescription[] = [
      {
        websiteTitle: 'Software Developer',
        websiteOrganization: 'Tech Corp',
        websiteLocation: 'San Francisco',
        websiteDatePublished: '2024-01-15'
      },
      {
        websiteTitle: 'Frontend Engineer',
        websiteOrganization: 'Startup Inc',
        websiteLocation: 'New York',
        websiteDatePublished: '2024-02-20'
      }
    ];

    const mockApiResponse = {
      searches: mockJobData
    };

    it('should make successful API call without parameters', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockApiResponse)
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await getJobData('');

      expect(mockFetch).toHaveBeenCalledWith('/api', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      expect(result).toEqual({
        data: mockApiResponse,
        status: 200
      });
    });

    it('should handle endpoint with leading slash', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockApiResponse)
      };
      mockFetch.mockResolvedValue(mockResponse);

      await getJobData('/jobs');

      expect(mockFetch).toHaveBeenCalledWith('/api/jobs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should use default base URL when VITE_API_BASE_URL is not set', async () => {
      vi.stubGlobal('import.meta', {
        env: {}
      });

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockApiResponse)
      };
      mockFetch.mockResolvedValue(mockResponse);

      await getJobData('');

      expect(mockFetch).toHaveBeenCalledWith('/api', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      vi.stubGlobal('import.meta', {
        env: {
          VITE_API_BASE_URL: '/api'
        }
      });
    });

    it('should handle HTTP 404 error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(getJobData('/something-nonexistent')).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should handle HTTP 500 error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(getJobData('')).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle network error (TypeError)', async () => {
      mockFetch.mockRejectedValue(new TypeError('Network request failed'));

      await expect(getJobData('')).rejects.toThrow('Network error - please check your connection');
    });

    it('should handle other errors', async () => {
      const customError = new Error('Custom error');
      mockFetch.mockRejectedValue(customError);

      await expect(getJobData('')).rejects.toThrow('Custom error');
    });

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockRejectedValue(new SyntaxError('Invalid JSON'))
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(getJobData('')).rejects.toThrow('Invalid JSON');
    });

    it('should return correct response structure', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        json: vi.fn().mockResolvedValue(mockApiResponse)
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await getJobData('');

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('status');
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockApiResponse);
    });

    it('should handle undefined params', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockResolvedValue(mockApiResponse)
      };
      mockFetch.mockResolvedValue(mockResponse);

      await getJobData('', undefined);

      expect(mockFetch).toHaveBeenCalledWith('/api', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  describe('Type definitions', () => {
    it('should have correct JobDescription interface structure', () => {
      const jobDescription: JobDescription = {
        websiteTitle: 'Test Job',
        websiteOrganization: 'Test Org',
        websiteLocation: 'Test Location',
        websiteDatePublished: '2024-01-01'
      };

      expect(jobDescription).toHaveProperty('websiteTitle');
      expect(jobDescription).toHaveProperty('websiteOrganization');
      expect(jobDescription).toHaveProperty('websiteLocation');
      expect(jobDescription).toHaveProperty('websiteDatePublished');
    });

    it('should have correct JobApiResponse interface structure', () => {
      const apiResponse: JobApiResponse = {
        data: {
          searches: []
        },
        status: 200
      };

      expect(apiResponse).toHaveProperty('data');
      expect(apiResponse).toHaveProperty('status');
      expect(apiResponse.data).toHaveProperty('searches');
    });
  });
}); 