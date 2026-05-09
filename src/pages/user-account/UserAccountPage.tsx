import { Card, Table, Tag } from 'antd'

const userData = [
  { key: '1', account: 'customer001', phone: '138****1024', status: '正常', orders: 8 },
  { key: '2', account: 'customer002', phone: '136****7788', status: '正常', orders: 3 },
  { key: '3', account: 'customer003', phone: '159****2366', status: '停用', orders: 0 },
]

function UserAccountPage() {
  return (
    <Card title="用户账户查询" bordered={false}>
      <Table
        pagination={false}
        dataSource={userData}
        columns={[
          { title: '账号', dataIndex: 'account' },
          { title: '手机号', dataIndex: 'phone' },
          {
            title: '状态',
            dataIndex: 'status',
            render: (status: string) => (
              <Tag color={status === '正常' ? 'green' : 'red'}>{status}</Tag>
            ),
          },
          { title: '订单数', dataIndex: 'orders' },
        ]}
      />
    </Card>
  )
}

export default UserAccountPage
