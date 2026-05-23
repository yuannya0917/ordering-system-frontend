import { api, request } from '../request'

export type MenuItem = {
  menuId: string
  menuName: string
  cover?: string | null
  remark?: string | null
  createTime?: string | null
}

export type GetMenuListParams = {
  menuName?: string
}

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

export function getMenuList(params?: GetMenuListParams) {
  return api.get<MenuItem[]>('/menu/list', { params })
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
