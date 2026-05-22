import { api, request } from '../request'

export type AddMenuParams = {
  menuId: string
  menuName: string
  remark?: string
  createTime?: string
}

export type DeleteMenuParams = {
  menuId: string
}

export type UpdateMenuParams = {
  menuId: string
  menuName: string
  remark?: string
}

export function addMenu(params: AddMenuParams) {
  return api.post<boolean>('/menu/add', params)
}

export function updateMenu(params: UpdateMenuParams) {
  return api.put<boolean>('/menu/update', params)
}

export function deleteMenu(params: DeleteMenuParams) {
  return request<boolean>('/menu/delete', {
    method: 'DELETE',
    body: params,
  })
}
