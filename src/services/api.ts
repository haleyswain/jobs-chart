interface JobDescription {
  websiteTitle: string;
  websiteOrganization: string;
  websiteLocation: string;
  websiteDatePublished: string;
}

interface BaseApiResponse {
  status: number;
}

interface JobApiResponse extends BaseApiResponse {
  data: {
    searches: JobDescription[];
  };
}

export const apiGet = async (
  endpoint: string,
  params?: Record<string, any>
): Promise<JobApiResponse> => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  const url = `${baseURL}${endpoint}${queryString}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Network error - please check your connection');
    }
    throw error;
  }
};

export type { JobApiResponse, BaseApiResponse, JobDescription }; 