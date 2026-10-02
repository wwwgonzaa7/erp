import type { ApiEndpoint } from './endpoints'

export type ApiRequestOptions = RequestInit & { method: string }
export type RequestHeadersProvider = () => HeadersInit | undefined

let requestHeadersProvider: RequestHeadersProvider | null = null

export function setRequestHeadersProvider(provider: RequestHeadersProvider | null): void {
  requestHeadersProvider = provider
}

export function apiUrl(endpoint: ApiEndpoint): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') ?? ''
  return `${baseUrl}${endpoint}`
}

export function requestApi(endpoint: ApiEndpoint, options: ApiRequestOptions): Promise<Response> {
  const headers = new Headers(requestHeadersProvider?.())
  new Headers(options.headers).forEach((value, name) => headers.set(name, value))

  return fetch(apiUrl(endpoint), { ...options, headers })
}
