import { API_BASE_URL, api } from '../request'

type ApiResponse<T> = {
  code?: number
  message?: string
  msg?: string
  data?: T
}

export type UploadDishImageParams = {
  dishId: string
  dishName: string
  file: File
}

export type DishImage = {
  id: number
  dish_id: string
  dish_name: string
  image_url: string
  create_time: string
  update_time: string
}

function buildApiUrl(path: string) {
  const requestPath = path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  return new URL(requestPath, window.location.origin).toString()
}

function unwrapResponse<T>(result: ApiResponse<T> | T) {
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

export async function uploadDishImage(params: UploadDishImageParams) {
  const formData = new FormData()
  formData.append('dishId', params.dishId)
  formData.append('dishName', params.dishName)
  formData.append('file', params.file)

  const response = await fetch(buildApiUrl('/dish-image/upload'), {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`)
  }

  const result = (await response.json()) as ApiResponse<string>
  return unwrapResponse(result)
}

export function getDishImage(dishId: string) {
  return api.get<DishImage>(`/dish-image/${dishId}`)
}
