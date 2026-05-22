import { api, request } from '../request'

export type AddDishParams = {
  dishId: string
  dishName: string
  dishPrice: string
  dishIntroduction?: string
  menuId: string
}

export type UpdateDishParams = AddDishParams

export type DeleteDishParams = {
  dishId: string
}

export function addDish(params: AddDishParams) {
  return api.post<boolean>('/dish/add', params)
}

export function updateDish(params: UpdateDishParams) {
  return api.put<null>('/dish/update', params)
}

export function deleteDish(params: DeleteDishParams) {
  return request<null>('/dish/delete', {
    method: 'DELETE',
    body: params,
  })
}
