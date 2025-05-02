import axios, { AxiosRequestConfig } from 'axios';
import { env } from '@/env.mjs';

// type RequestOptions = AxiosRequestConfig & {
//   params?: Record<string, string | number>;
// };
type RequestOptions = AxiosRequestConfig;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T | undefined> {

  try {
    const url = new URL(endpoint, env.NEXT_PUBLIC_API_URL).toString();
    // console.log('[API REQUEST]', {
    //   url,
    //   method: options.method || 'GET',
    //   params: options.params,
    //   data: options.data,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     ...(options.headers || {}),
    //   }
    // });
    const response = await axios<T>(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
    //   const status = error.response?.status;
    //   throw new Error(`API error: ${status || 'Unknown error'}`);
    console.error("Axios error:", error.message, error.response?.data);
    }
    // throw new Error('An unexpected error occurred');
    console.error("Unexpected error:", error);
  }
}