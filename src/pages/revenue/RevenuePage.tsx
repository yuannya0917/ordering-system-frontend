import { Card, Col, Row, Statistic } from 'antd'

function RevenuePage() {
  return (
    <Card title="查看营业额" bordered={false}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Statistic title="今日营业额" value={2386} precision={2} prefix="¥" />
        </Col>
        <Col xs={24} md={8}>
          <Statistic title="本月营业额" value={48620} precision={2} prefix="¥" />
        </Col>
        <Col xs={24} md={8}>
          <Statistic title="完成订单" value={1268} suffix="单" />
        </Col>
      </Row>
    </Card>
  )
}

export default RevenuePage
