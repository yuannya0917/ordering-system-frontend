import { Button, Card, Col, DatePicker, Form, Row, Space, Statistic, message } from 'antd'
import type { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { getTotalAmount } from '../../api/revenue'
import type { GetTotalAmountParams, TotalAmountResult } from '../../api/revenue'

type RevenueSearchValues = {
  timeRange?: [Dayjs, Dayjs]
  orderStatus?: string
}

const { RangePicker } = DatePicker

function normalizeSearchValues(values: RevenueSearchValues): GetTotalAmountParams {
  return {
    startTime: values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
    endTime: values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
    orderStatus: values.orderStatus,
  }
}

function RevenuePage() {
  const [form] = Form.useForm<RevenueSearchValues>()
  const [revenueData, setRevenueData] = useState<TotalAmountResult>({
    totalAmount: 0,
    orderCount: 0,
    startTime: null,
    endTime: null,
  })
  const [loading, setLoading] = useState(false)

  const fetchTotalAmount = async (values: RevenueSearchValues = {}) => {
    setLoading(true)

    try {
      const data = await getTotalAmount(normalizeSearchValues(values))
      setRevenueData(data)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取营业额失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchTotalAmount()
  }, [])

  const handleReset = () => {
    form.resetFields()
    void fetchTotalAmount()
  }

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={form} onFinish={fetchTotalAmount} style={{ width: '100%' }}>
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
    </>
  )
}

export default RevenuePage
