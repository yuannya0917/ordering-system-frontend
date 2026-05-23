import { api, request } from '../request'

export type DishItem = {
  dishId: string
  dishName: string
  dishPrice: number
  dishIntroduction?: string | null
  menuId?: string | null
  menuName?: string | null
  dishImage?: string | null
}

export type GetDishListParams = {
  dishId?: string
  dishName?: string
  menuId?: string
}

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

export function getDishList(params?: GetDishListParams) {
  return api.get<DishItem[]>('/dish/list', { params })
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
