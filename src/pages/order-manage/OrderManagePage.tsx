import { Button, Card, Table, Tag } from 'antd'

const orderData = [
  { key: '1', no: 'DD20260509001', customer: 'A12 桌', amount: '62.00', status: '制作中' },
  { key: '2', no: 'DD20260509002', customer: 'B03 桌', amount: '46.00', status: '待接单' },
  { key: '3', no: 'DD20260509003', customer: '外带顾客', amount: '89.00', status: '已完成' },
]

function OrderManagePage() {
  return (
    <Card title="订单管理系统" bordered={false}>
      <Table
        pagination={false}
        dataSource={orderData}
        columns={[
          { title: '订单号', dataIndex: 'no' },
          { title: '顾客', dataIndex: 'customer' },
          {
            title: '金额',
            dataIndex: 'amount',
            render: (amount: string) => `¥${amount}`,
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: (status: string) => <Tag color="blue">{status}</Tag>,
          },
          {
            title: '操作',
            render: () => <Button size="small">查看详情</Button>,
          },
        ]}
      />
    </Card>
  )
}

export default OrderManagePage
