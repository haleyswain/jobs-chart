import { getJobData, type JobDescription } from './api';

export const getJobDescriptions = async (query?: string): Promise<JobDescription[]> => {
  const params = query ? { q: query } : undefined;
  const response = await getJobData('', params);
  return response.data.searches;
};

export type { JobDescription }; 