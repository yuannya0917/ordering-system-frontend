const DEFAULT_API_BASE_URL = import.meta.env.PROD 
  ? 'http://10.100.147.122:8081'  // 生产环境使用完整 URL
  : '/api'  // 开发环境使用 proxy

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiResponse<T> = {
  code?: number
  message?: string
  msg?: string
  data?: T
}

type RequestOptions = Omit<RequestInit, 'body' | 'method'> & {
  method?: RequestMethod
  body?: unknown
  params?: Record<string, string | number | boolean | undefined | null>
}

function buildUrl(path: string, params?: RequestOptions['params']) {
  const requestPath = path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  const url = new URL(requestPath, window.location.origin)

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, headers, ...restOptions } = options

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...restOptions,
  })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  const result = (await response.json()) as ApiResponse<T> | T

  if (
    typeof result === 'object' &&
    result !== null &&
    'code' in result &&
    result.code !== 0 &&
    result.code !== 200
  ) {
    throw new Error(result.message || result.msg || '请求失败')
  }

  if (typeof result === 'object' && result !== null && 'data' in result) {
    return result.data as T
  }

  return result as T
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
