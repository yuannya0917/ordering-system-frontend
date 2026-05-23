import { api } from '../request'

export type GetTotalAmountParams = {
  startTime?: string
  endTime?: string
  orderStatus?: string
}

export type TotalAmountResult = {
  totalAmount: number
  orderCount: number
  startTime: string | null
  endTime: string | null
}

export function getTotalAmount(params?: GetTotalAmountParams) {
  return api.get<TotalAmountResult>('/order/totalAmount', { params })
}
