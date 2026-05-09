import { api } from '../request'

export type LoginParams = {
  userId: string
  userPassword: string
}

export type UserType = 'customer' | 'admin'

export type LoginResult = {
  userId: string
  userType: UserType
}

export function login(params: LoginParams) {
  return api.post<LoginResult>('/auth/login', params)
}
