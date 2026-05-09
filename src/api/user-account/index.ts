import { api } from '../request'

export type UserType = 'customer' | 'admin'

export type GetUserInfoParams = {
  userId: string
  currentUserId: string
}

export type UserInfo = {
  userId: string
  userType: UserType
  securityQuestion: string | null
  securityAnswer: string | null
  merchantName: string | null
}

export function getUserInfo(params: GetUserInfoParams) {
  return api.get<UserInfo>('/auth/info', { params })
}
