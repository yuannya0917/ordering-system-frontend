import { api } from '../request'

export type UserAccount = {
  userId: string
  username: string
  securityQuestion: string | null
  totalAmount: number
  orderCount: number
}

export type GetAllUsersParams = {
  currentUserId: string
}

export type QueryUsersParams = {
  currentUserId: string
  userId?: string
  username?: string
  page: number
  pageSize: number
}

export type QueryUsersResult = {
  records: UserAccount[]
  total: number
  size: number
  current: number
  pages: number
}

export function getAllUsers(params: GetAllUsersParams) {
  return api.get<UserAccount[]>('/auth/getAllUsers', { params })
}

export function queryUsers(params: QueryUsersParams) {
  return api.post<QueryUsersResult>('/auth/queryUsers', params)
}
