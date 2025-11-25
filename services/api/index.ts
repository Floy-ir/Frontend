import axios, { AxiosRequestConfig } from "axios"
import { env } from "@/env.mjs"
import { getPlatformBoundAuthToken } from "@/utils/miniapp"

// type RequestOptions = AxiosRequestConfig & {
//   params?: Record<string, string | number>;
// };
type RequestOptions = AxiosRequestConfig

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T | undefined> {
  try {
    const url = new URL(endpoint, env.NEXT_PUBLIC_API_URL).toString()
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
    // attach token if present (guarded by mini app platform to avoid cross-app reuse)
    const token = typeof window !== "undefined" ? getPlatformBoundAuthToken() : null
    const response = await axios<T>(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    // console.log(options)
    // console.log(response.data);

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const respData = error.response?.data
      const status = error.response?.status
      type ErrorWithResponse = Error & { response?: unknown; status?: number }
      const err: ErrorWithResponse = new Error(error.message)
      err.response = respData
      err.status = status
      throw err
    }
    type ErrorWithResponse = Error & { response?: unknown }
    const err: ErrorWithResponse = new Error("Unexpected error")
    err.response = error
    throw err
  }
}
