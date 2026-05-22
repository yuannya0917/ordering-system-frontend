import { api } from '../request'

export type UpdateOrderStatusParams = {
  orderId: string
  orderStatus: string
}

export function updateOrderStatus(params: UpdateOrderStatusParams) {
  return api.put<boolean>('/order/status', params)
}
