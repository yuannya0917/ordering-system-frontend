import { Button, Radio, Row, Space, Table, Tag, Typography, message } from 'antd'
import type { RadioChangeEvent, TableColumnsType } from 'antd'
import { useMemo, useState } from 'react'

type OrderStatus = '未接单' | '进行中' | '已完成'
type OrderStatusFilter = '全部' | OrderStatus

type OrderCuisine = {
  name: string
  count: number
}

type OrderRecord = {
  key: string
  orderNo: string
  cuisines: OrderCuisine[]
  orderTime: string
  totalPrice: number
  status: OrderStatus
}

type OrderCountMap = Record<OrderStatusFilter, number>

const initialOrderData: OrderRecord[] = [
  {
    key: '1',
    orderNo: 'DD20260509001',
    cuisines: [
      { name: '招牌黑椒牛柳饭', count: 1 },
      { name: '柠檬气泡茶', count: 2 },
    ],
    orderTime: '2026-05-09 12:18',
    totalPrice: 62,
    status: '进行中',
  },
  {
    key: '2',
    orderNo: 'DD20260509002',
    cuisines: [
      { name: '番茄肥牛面', count: 1 },
      { name: '小吃拼盘', count: 1 },
    ],
    orderTime: '2026-05-09 12:24',
    totalPrice: 46,
    status: '未接单',
  },
  {
    key: '3',
    orderNo: 'DD20260509003',
    cuisines: [
      { name: '招牌黑椒牛柳饭', count: 2 },
      { name: '柠檬气泡茶', count: 1 },
    ],
    orderTime: '2026-05-09 11:42',
    totalPrice: 89,
    status: '已完成',
  },
  {
    key: '4',
    orderNo: 'DD20260509004',
    cuisines: [
      { name: '柠檬气泡茶', count: 1 },
      { name: '小吃拼盘', count: 2 },
      { name: '番茄肥牛面', count: 1 },
    ],
    orderTime: '2026-05-09 12:31',
    totalPrice: 74,
    status: '未接单',
  },
]

const statusColorMap: Record<OrderStatus, string> = {
  未接单: 'orange',
  进行中: 'blue',
  已完成: 'green',
}

const statusOptions: OrderStatusFilter[] = ['全部', '未接单', '进行中', '已完成']

function createOrderColumns(
  onAccept: (key: string) => void,
  onComplete: (key: string) => void,
): TableColumnsType<OrderRecord> {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 180,
      render: (orderNo: string) => (
        <Typography.Text style={{ color: '#5f6368' }}>
          {orderNo}
        </Typography.Text>
      ),
    },
    {
      title: '菜品列表',
      dataIndex: 'cuisines',
      render: (cuisines: OrderCuisine[]) => (
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: 320,
              }}
            >
              <Typography.Text>{cuisine.name}</Typography.Text>
              <Typography.Text type="secondary">x{cuisine.count}</Typography.Text>
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      width: 170,
      render: (orderTime: string) => (
        <Typography.Text type="secondary">{orderTime}</Typography.Text>
      ),
    },
    {
      title: '总价格',
      dataIndex: 'totalPrice',
      width: 140,
      align: 'right',
      render: (totalPrice: number) => (
        <Typography.Text strong>￥{totalPrice.toFixed(2)}</Typography.Text>
      ),
    },
    {
      title: '交易状态',
      dataIndex: 'status',
      width: 120,
      render: (status: OrderStatus) => <Tag color={statusColorMap[status]}>{status}</Tag>,
    },
    {
      title: '操作',
      width: 140,
      render: (_, record) => {
        if (record.status === '未接单') {
          return (
            <Button type="primary" size="small" onClick={() => onAccept(record.key)}>
              接单
            </Button>
          )
        }

        if (record.status === '进行中') {
          return (
            <Button size="small" onClick={() => onComplete(record.key)}>
              完成订单
            </Button>
          )
        }

        return <Button size="small">查看详情</Button>
      },
    },
  ]
}

function OrderManagePage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('全部')
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrderData)

  const orderCounts = useMemo<OrderCountMap>(() => {
    return {
      全部: orders.length,
      未接单: orders.filter((order) => order.status === '未接单').length,
      进行中: orders.filter((order) => order.status === '进行中').length,
      已完成: orders.filter((order) => order.status === '已完成').length,
    }
  }, [orders])

  const filteredOrderData = useMemo(() => {
    if (statusFilter === '全部') {
      return orders
    }

    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  const handleStatusChange = (event: RadioChangeEvent) => {
    setStatusFilter(event.target.value)
  }

  const handleAccept = (key: string) => {
    setOrders((data) =>
      data.map((order) => (order.key === key ? { ...order, status: '进行中' } : order)),
    )
    message.success('已接单')
  }

  const handleComplete = (key: string) => {
    setOrders((data) =>
      data.map((order) => (order.key === key ? { ...order, status: '已完成' } : order)),
    )
    message.success('订单已完成')
  }

  const orderColumns = useMemo(
    () => createOrderColumns(handleAccept, handleComplete),
    [],
  )

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={statusFilter}
          onChange={handleStatusChange}
          options={statusOptions.map((status) => ({
            label: `${status} ${orderCounts[status]}`,
            value: status,
          }))}
        />
      </Row>

      <Row style={{ width: '100%' }}>
        <Table
          style={{ width: '100%' }}
          dataSource={filteredOrderData}
          columns={orderColumns}
          pagination={{ pageSize: 8 }}
        />
      </Row>
    </>
  )
}

export default OrderManagePage
