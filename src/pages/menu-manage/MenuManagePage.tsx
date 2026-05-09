import { Button, Card, Space, Table } from 'antd'

const dishData = [
  { name: '招牌黑椒牛柳饭', category: '主食', price: '32.00', stock: 48 },
  { name: '番茄肥牛面', category: '主食', price: '29.00', stock: 32 },
  { name: '柠檬气泡茶', category: '饮品', price: '15.00', stock: 76 },
]

function MenuManagePage() {
  return (
    <Card
      title="管理菜单页面"
      extra={<Button type="primary">新增菜品</Button>}
      bordered={false}
    >
      <Table
        pagination={false}
        dataSource={dishData}
        rowKey="name"
        columns={[
          { title: '菜品名称', dataIndex: 'name' },
          { title: '分类', dataIndex: 'category' },
          {
            title: '价格',
            dataIndex: 'price',
            render: (price: string) => `¥${price}`,
          },
          { title: '库存', dataIndex: 'stock' },
          {
            title: '操作',
            render: () => (
              <Space>
                <Button size="small">编辑</Button>
                <Button size="small" danger>
                  下架
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  )
}

export default MenuManagePage
