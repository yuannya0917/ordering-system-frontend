import { Button, Col, Form, Input, Radio, Row, Space, Table, Tag, Typography, message } from 'antd'
import type { RadioChangeEvent, TableColumnsType } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getAllOrders,
  getOrderDetails,
  subscribeMerchantNewOrders,
  updateOrderStatus,
} from '../../api/order-manage'
import type {
  GetAllOrdersParams,
  OrderDetailItem,
  OrderItem,
  OrderStatusCode,
} from '../../api/order-manage'
import './OrderManagePage.css'

type OrderStatusFilter = 'all' | OrderStatusCode

type SearchValues = {
  userId?: string
}

type OrderRecord = OrderItem & {
  key: string
  details: OrderDetailItem[]
}

const statusLabelMap: Record<OrderStatusCode, string> = {
  '0': '待确认',
  '1': '已接单',
  '2': '已完成',
}

const statusColorMap: Record<OrderStatusCode, string> = {
  '0': 'orange',
  '1': 'processing',
  '2': 'success',
}

const statusOptions: Array<{ label: string; value: OrderStatusFilter }> = [
  { label: '全部', value: 'all' },
  { label: '待确认', value: '0' },
  { label: '已接单', value: '1' },
  { label: '已完成', value: '2' },
]

const inlineOrderDetailColumns: TableColumnsType<OrderDetailItem> = [
  { title: '菜品名称', dataIndex: 'dishName' },
  { title: '数量', dataIndex: 'dishNum', width: 72, align: 'center' },
  {
    title: '总价',
    dataIndex: 'totalPrice',
    width: 100,
    align: 'right',
    render: (totalPrice: number) => `¥${Number(totalPrice || 0).toFixed(2)}`,
  },
]

function normalizeSearchValues(values: SearchValues, statusFilter: OrderStatusFilter): GetAllOrdersParams {
  return {
    userId: values.userId?.trim() || undefined,
    orderStatus: statusFilter === 'all' ? undefined : statusFilter,
  }
}

async function toOrderRecords(data: OrderItem[]): Promise<OrderRecord[]> {
  return Promise.all(
    data.map(async (order) => {
      try {
        const details = await getOrderDetails(order.orderId)
        return { ...order, key: order.orderId, details }
      } catch {
        return { ...order, key: order.orderId, details: [] }
      }
    }),
  )
}

function formatOrderTime(orderTime: string) {
  return orderTime.replace('T', ' ')
}

function renderOrderDetails(details: OrderDetailItem[]) {
  if (!details.length) {
    return '-'
  }

  return (
    <Table<OrderDetailItem>
      rowKey={(record) => `${record.orderId}-${record.dishId}`}
      size="small"
      dataSource={details}
      columns={inlineOrderDetailColumns}
      pagination={false}
    />
  )
}

function createOrderColumns(
  onAccept: (orderId: string) => void,
  onComplete: (orderId: string) => void,
  updatingOrderId?: string,
): TableColumnsType<OrderRecord> {
  return [
    {
      title: '订单ID',
      dataIndex: 'orderId',
      width: 140,
      render: (orderId: string) => <Typography.Text>{orderId}</Typography.Text>,
    },
    { title: '用户ID', dataIndex: 'userId', width: 150 },
    {
      title: '订单详情',
      dataIndex: 'details',
      width: 380,
      render: (details: OrderDetailItem[]) => renderOrderDetails(details),
    },
    {
      title: '订单金额',
      dataIndex: 'orderPrice',
      width: 120,
      align: 'right',
      render: (orderPrice: number) => (
        <Typography.Text strong>¥{Number(orderPrice || 0).toFixed(2)}</Typography.Text>
      ),
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      width: 180,
      render: (orderTime: string) => (
        <Typography.Text type="secondary">{formatOrderTime(orderTime)}</Typography.Text>
      ),
    },
    {
      title: '订单备注',
      dataIndex: 'orderNote',
      render: (orderNote: string) => orderNote || '-',
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 120,
      render: (orderStatus: OrderStatusCode) => (
        <Tag color={statusColorMap[orderStatus]}>{statusLabelMap[orderStatus]}</Tag>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_, record) => {
        if (record.orderStatus === '0') {
          return (
            <Button
              type="primary"
              size="small"
              loading={updatingOrderId === record.orderId}
              onClick={() => onAccept(record.orderId)}
              danger
            >
              接单
            </Button>
          )
        }

        if (record.orderStatus === '1') {
          return (
            <Button
              size="small"
              loading={updatingOrderId === record.orderId}
              onClick={() => onComplete(record.orderId)}
              danger
            >
              完成订单
            </Button>
          )
        }

        return '-'
      },
    },
  ]
}

function OrderManagePage() {
  const [form] = Form.useForm<SearchValues>()
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all')
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string>()
  const statusFilterRef = useRef<OrderStatusFilter>('all')

  const fetchOrders = useCallback(async (values?: SearchValues, nextStatus?: OrderStatusFilter) => {
    setLoading(true)

    try {
      const effectiveValues = values ?? form.getFieldsValue()
      const effectiveStatus = nextStatus ?? statusFilterRef.current
      const data = await getAllOrders(normalizeSearchValues(effectiveValues, effectiveStatus))
      setOrders(await toOrderRecords(data))
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取订单列表失败')
    } finally {
      setLoading(false)
    }
  }, [form])

  useEffect(() => {
    void fetchOrders({})
  }, [fetchOrders])

  const handleStatusChange = (event: RadioChangeEvent) => {
    const nextStatus = event.target.value as OrderStatusFilter
    setStatusFilter(nextStatus)
    statusFilterRef.current = nextStatus
    void fetchOrders(form.getFieldsValue(), nextStatus)
  }

  const handleReset = () => {
    form.resetFields()
    setStatusFilter('all')
    statusFilterRef.current = 'all'
    void fetchOrders({}, 'all')
  }

  const updateStatus = async (orderId: string, orderStatus: OrderStatusCode, successText: string) => {
    setUpdatingOrderId(orderId)

    try {
      await updateOrderStatus({ orderId, orderStatus })
      await fetchOrders()
      message.success(successText)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '修改订单状态失败')
    } finally {
      setUpdatingOrderId(undefined)
    }
  }

  const orderColumns = useMemo(
    () =>
      createOrderColumns(
        (orderId) => void updateStatus(orderId, '1', '已接单'),
        (orderId) => void updateStatus(orderId, '2', '订单已完成'),
        updatingOrderId,
      ),
    [updatingOrderId],
  )

  useEffect(() => {
    const unsubscribe = subscribeMerchantNewOrders({
      onMessage: () => {
        void fetchOrders(form.getFieldsValue(), statusFilterRef.current)
      },
      onError: () => {
        message.warning('')
      },
    })

    return () => {
      unsubscribe()
    }
  }, [fetchOrders, form])

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={form} onFinish={(values) => fetchOrders(values)} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col>
              <Space>
                <Form.Item style={{ marginBottom: 0 }} label="用户ID" name="userId">
                  <Input allowClear placeholder="请输入用户ID" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} danger>
                  查询
                </Button>
                <Button onClick={handleReset} danger>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Row>

      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Radio.Group
          className="order-status-filter"
          optionType="button"
          buttonStyle="solid"
          value={statusFilter}
          onChange={handleStatusChange}
          options={statusOptions}
        />
      </Row>

      <Row style={{ width: '100%' }}>
        <Table<OrderRecord>
          rowKey="orderId"
          style={{ width: '100%' }}
          loading={loading}
          dataSource={orders}
          columns={orderColumns}
          pagination={{ pageSize: 8 }}
        />
      </Row>
    </>
  )
}

export default OrderManagePage
