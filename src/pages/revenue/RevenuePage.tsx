import { Card, Col, DatePicker, Form, Row, Statistic, Table, Typography } from 'antd'
import type { TableColumnsType } from 'antd'

type RevenueDetailRecord = {
  key: string
  source: string
  time: string
  income: number
}

const revenueDetailData: RevenueDetailRecord[] = [
  { key: '1', source: '微信收款', time: '2026-05-09 12:18', income: 62 },
  { key: '2', source: '微信收款', time: '2026-05-09 11:42', income: 89 },
  { key: '3', source: '微信收款', time: '2026-05-09 10:36', income: 128 },
  { key: '4', source: '微信退款', time: '2026-05-09 09:24', income: -18 },
]

const revenueColumns: TableColumnsType<RevenueDetailRecord> = [
  { title: '来源', dataIndex: 'source',width:20},
  {
    title: '时间',
    dataIndex: 'time',
    width: 100,
    render: (time: string) => <Typography.Text type="secondary">{time}</Typography.Text>,
  },
  {
    title: '收入额',
    dataIndex: 'income',
    width: 140,
    align: 'right',
    render: (income: number) => (
      <Typography.Text strong type={income < 0 ? 'danger' : undefined}>
        {income < 0 ? '-' : ''}￥{Math.abs(income).toFixed(2)}
      </Typography.Text>
    ),
  },
]

function RevenuePage() {
  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form style={{ width: '100%' }}>
          <Form.Item style={{ marginBottom: 0 }} label="选择日期" name="date">
            <DatePicker placeholder="请选择日期" />
          </Form.Item>
        </Form>
      </Row>

      <Card style={{minHeight:'auto',marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic title="今日营业额（元）" value={2386} precision={2} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic title="实际收入（元）" value={2268} precision={2} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic title="退款金额（元）" value={118} precision={2} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic title="订单数（单）" value={42} />
          </Col>
        </Row>
      </Card>

      <Row style={{ width: '100%' }}>
        <Table
          style={{ width: '100%' }}
          dataSource={revenueDetailData}
          columns={revenueColumns}
        />
      </Row>
    </>
  )
}

export default RevenuePage
