import { useMount } from 'react-use'

export interface FetchResponseInterceptCallback {
  (response: Response): Response | Promise<Response>
}
export interface FetchRequestInterceptCallback {
  (fetch: typeof window.fetch, input: RequestInfo | URL, init?: RequestInit | undefined): Response | Promise<Response>
}

export function useFetchResponseIntercept(cb: FetchResponseInterceptCallback) {
  useMount(() => fetchResponseIntercept(cb))
}

export function useFetchRequestIntercept(cb: FetchRequestInterceptCallback) {
  useMount(() => fetchRequestIntercept(cb))
}

function fetchResponseIntercept(callback: FetchResponseInterceptCallback) {
  const { fetch: originalFetch } = window
  window.fetch = async (...args) => {
    const [resource, config] = args
    // request interceptor here
    const response = await originalFetch(resource, config)
    // response interceptor here
    return callback(response)
  }
}

function fetchRequestIntercept(callback: FetchRequestInterceptCallback) {
  const { fetch: originalFetch } = window
  window.fetch = async (...args) => {
    const [resource, config] = args
    // request interceptor here
    return callback(originalFetch, resource, config)
  }
}
