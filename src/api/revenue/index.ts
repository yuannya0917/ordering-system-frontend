import { api } from '../request'


export type OrderStatusCode = '0' | '1' | '2'

export type GetTotalAmountParams = {
  startTime?: string
  endTime?: string
  orderStatus?: string
}

export type OrderItem = {
  orderId: string
  userId: string
  orderPrice: number
  orderTime: string
  orderNote: string
  orderStatus: OrderStatusCode
}

export type TotalAmountResult = {
  totalAmount: number
  orderCount: number
  startTime: string | null
  endTime: string | null
}

export type GetAllOrdersParams = {
  userId?: string
  orderStatus?: string
  startTime?:string
  endTime?:string
}

export function getTotalAmount(params?: GetTotalAmountParams) {
  return api.get<TotalAmountResult>('/order/totalAmount', { params })
}

export function getAllOrders(params?: GetAllOrdersParams) {
  return api.get<OrderItem[]>('/order/all', { params })
}