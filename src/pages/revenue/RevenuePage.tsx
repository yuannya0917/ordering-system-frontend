import { Button, Card, Col, DatePicker, Form, Row, Space, Statistic, Table, Tag, message } from 'antd'
import type { TableColumnsType } from 'antd'
import type { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { getAllOrders, getTotalAmount } from '../../api/revenue'
import type { GetAllOrdersParams, GetTotalAmountParams, OrderItem, OrderStatusCode, TotalAmountResult } from '../../api/revenue'

type RevenueSearchValues = {
  timeRange?: [Dayjs, Dayjs]
  orderStatus?: string
}

type OrderRecord = OrderItem & {
  key: string
}

const { RangePicker } = DatePicker


function normalizeSearchValues(values: RevenueSearchValues): GetTotalAmountParams & GetAllOrdersParams {
  return {
    startTime: values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
    endTime: values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    orderStatus: '2',
  }
}

function formatOrderTime(orderTime: string) {
  return orderTime?.replace('T', ' ') || '-'
}

const orderColumns: TableColumnsType<OrderRecord> = [
  { title: '订单ID', dataIndex: 'orderId', width: 140 },
  { title: '用户ID', dataIndex: 'userId', width: 150 },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    width: 180,
    render: (orderTime: string) => formatOrderTime(orderTime),
  },
    {
    title: '订单金额',
    dataIndex: 'orderPrice',
    width: 120,
    align: 'right',
    render: (orderPrice: number) => `¥${Number(orderPrice || 0).toFixed(2)}`,
  },
]

function RevenuePage() {
  const [form] = Form.useForm<RevenueSearchValues>()
  const [revenueData, setRevenueData] = useState<TotalAmountResult>({
    totalAmount: 0,
    orderCount: 0,
    startTime: null,
    endTime: null,
  })
  const [orderData, setOrderData] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRevenueData = async (values: RevenueSearchValues = {}) => {
    setLoading(true)

    try {
      const params = normalizeSearchValues(values)
      const [totalAmountData, allOrders] = await Promise.all([
        getTotalAmount(params),
        getAllOrders(params),
      ])

      setRevenueData(totalAmountData)
      setOrderData(allOrders.map((order) => ({ ...order, key: order.orderId })))
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取营业数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchRevenueData()
  }, [])

  const handleReset = () => {
    form.resetFields()
    void fetchRevenueData()
  }

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={form} onFinish={fetchRevenueData} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col>
              <Space>
                <Form.Item style={{ marginBottom: 0 }} label="时间范围" name="timeRange">
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
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

      <Card style={{ minHeight: 'auto', marginBottom: 16 }} loading={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Statistic title="总营业额（元）" value={revenueData.totalAmount} precision={2} />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="订单数（单）" value={revenueData.orderCount} />
          </Col>
        </Row>
      </Card>

      <Row style={{ width: '100%' }}>
        <Table<OrderRecord>
          rowKey="orderId"
          style={{ width: '100%' }}
          loading={loading}
          dataSource={orderData}
          columns={orderColumns}
          pagination={{ pageSize: 8 }}
        />
      </Row>
    </>
  )
}

export default RevenuePage
