import type { ApiResponse } from '@/types';

/**
 * Extracts data from API response, throwing if missing
 * @throws Error if response data is undefined
 */
export function extractData<T>(response: { data: ApiResponse<T> }): T {
  const data = response.data.data;
  if (data === undefined) {
    throw new Error('Invalid API response: missing data');
  }
  return data;
}

