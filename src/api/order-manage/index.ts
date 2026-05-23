import { api } from '../request'

export type OrderStatusCode = '0' | '1' | '2'

export type OrderItem = {
  orderId: string
  userId: string
  orderPrice: number
  orderTime: string
  orderNote: string
  orderStatus: OrderStatusCode
}

export type OrderDetailItem = {
  orderId: string
  dishId: string
  dishName: string
  dishNum: number
  dishPrice: number
  totalPrice: number
}

export type GetAllOrdersParams = {
  userId?: string
  orderStatus?: string
}

export type UpdateOrderStatusParams = {
  orderId: string
  orderStatus: string
}

export function getAllOrders(params?: GetAllOrdersParams) {
  return api.get<OrderItem[]>('/order/all', { params })
}

export function getOrderDetails(orderId: string) {
  return api.get<OrderDetailItem[]>(`/orderdetail/list/${orderId}`)
}

export function updateOrderStatus(params: UpdateOrderStatusParams) {
  return api.put<boolean>('/order/status', params)
}
