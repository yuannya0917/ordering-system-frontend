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

export type MerchantNewOrderNotice = {
  orderId: string
  userId: string
  orderPrice: number
  orderTime: string
  orderNote: string
  orderStatus: OrderStatusCode
}

type SubscribeMerchantNewOrdersParams = {
  onMessage: (payload: MerchantNewOrderNotice) => void
  onError?: (error: Event | CloseEvent) => void
}

function buildStompFrame(command: string, headers: Record<string, string>, body = '') {
  const headerText = Object.entries(headers)
    .map(([key, value]) => `${key}:${value}`)
    .join('\n')

  return `${command}\n${headerText}\n\n${body}\u0000`
}

function parseStompBody(frame: string) {
  const bodyStartIndex = frame.indexOf('\n\n')
  if (bodyStartIndex < 0) {
    return ''
  }

  const rawBody = frame.slice(bodyStartIndex + 2)
  return rawBody.replace(/\u0000/g, '').trim()
}

export function subscribeMerchantNewOrders({
  onMessage,
  onError,
}: SubscribeMerchantNewOrdersParams) {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const wsHost = import.meta.env.VITE_WS_HOST || window.location.hostname
  const wsPort = import.meta.env.VITE_WS_PORT || window.location.port
  const wsPath = import.meta.env.VITE_WS_PATH || '/ws'
  const wsUrl = `${wsProtocol}://${wsHost}:${wsPort}${wsPath}`
  const ws = new WebSocket(wsUrl)
  const subscriptionId = `merchant-new-orders-${Date.now()}`
  let isConnected = false
  let shouldCloseAfterOpen = false

  ws.onopen = () => {
    if (shouldCloseAfterOpen) {
      ws.close()
      return
    }

    ws.send(
      buildStompFrame('CONNECT', {
        'accept-version': '1.2',
        'heart-beat': '0,0',
      }),
    )
  }

  ws.onmessage = (event) => {
    const frame = String(event.data || '')

    if (frame.startsWith('CONNECTED')) {
      isConnected = true
      ws.send(
        buildStompFrame('SUBSCRIBE', {
          id: subscriptionId,
          destination: '/topic/merchant/new-orders',
        }),
      )
      return
    }

    if (!frame.startsWith('MESSAGE')) {
      return
    }

    try {
      const payload = JSON.parse(parseStompBody(frame)) as MerchantNewOrderNotice
      onMessage(payload)
    } catch {
      // Ignore malformed messages to keep subscription alive.
    }
  }

  ws.onerror = (error) => {
    onError?.(error)
  }

  ws.onclose = (event) => {
    if (!event.wasClean) {
      onError?.(event)
    }
  }

  return () => {
    shouldCloseAfterOpen = true

    if (isConnected && ws.readyState === WebSocket.OPEN) {
      ws.send(
        buildStompFrame('UNSUBSCRIBE', {
          id: subscriptionId,
        }),
      )
      ws.send(buildStompFrame('DISCONNECT', {}))
    }

    if (ws.readyState === WebSocket.OPEN) {
      ws.close()
    }
  }
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
