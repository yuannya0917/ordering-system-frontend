import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
} from 'antd'
import { useMemo, useState } from 'react'

type MenuRecord = {
  key: string
  category: string
  kindCount: number
}

type SearchValues = {
  menuName?: string
}

type MenuFormValues = {
  category: string
  kindCount: number
}

const initialMenuData: MenuRecord[] = [
  { key: '1', category: '主食', kindCount: 12 },
  { key: '2', category: '饮品', kindCount: 8 },
  { key: '3', category: '小吃', kindCount: 10 },
]

function MenuManagePage() {
  const [searchForm] = Form.useForm<SearchValues>()
  const [menuForm] = Form.useForm<MenuFormValues>()
  const [searchValues, setSearchValues] = useState<SearchValues>({})
  const [menuData, setMenuData] = useState<MenuRecord[]>(initialMenuData)
  const [editingMenu, setEditingMenu] = useState<MenuRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const menuColumns=[
            { title: '类别', dataIndex: 'category' },
            { title: '种类个数', dataIndex: 'kindCount' },
            {
              title: '操作',
              render: (_:any, record: MenuRecord) => (
                <Space>
                  <Button size="small" onClick={() => handleEdit(record)}>
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该菜单吗？"
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => handleDelete(record.key)}
                  >
                    <Button size="small" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]

  const filteredMenuData = useMemo(() => {
    const menuName = searchValues.menuName?.trim().toLowerCase()

    return menuData.filter((menu) => {
      return !menuName || menu.category.toLowerCase().includes(menuName)
    })
  }, [menuData, searchValues])

  const handleReset = () => {
    searchForm.resetFields()
    setSearchValues({})
  }

  const handleAdd = () => {
    setEditingMenu(null)
    menuForm.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (menu: MenuRecord) => {
    setEditingMenu(menu)
    menuForm.setFieldsValue({
      category: menu.category,
      kindCount: menu.kindCount,
    })
    setModalOpen(true)
  }

  const handleDelete = (key: string) => {
    setMenuData((data) => data.filter((menu) => menu.key !== key))
    message.success('删除成功')
  }

  const handleModalOk = async () => {
    const values = await menuForm.validateFields()

    if (editingMenu) {
      setMenuData((data) =>
        data.map((menu) => (menu.key === editingMenu.key ? { ...menu, ...values } : menu)),
      )
      message.success('编辑成功')
    } else {
      setMenuData((data) => [
        ...data,
        {
          key: `${Date.now()}`,
          ...values,
        },
      ])
      message.success('添加成功')
    }

    setModalOpen(false)
  }

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={searchForm} onFinish={setSearchValues} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col style={{ display: 'flex' }}>
              <Space>
                <Form.Item style={{ marginBottom: '0' }} label="菜单名称" name="menuName">
                  <Input allowClear placeholder="请输入菜单名称" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>

            <Col>
              <Button type="primary" onClick={handleAdd}>
                添加新菜单
              </Button>

            </Col>
          </Row>
        </Form>
      </Row>

      <Row style={{ width: '100%' }}>
        <Table
          style={{ width: '100%' }}
          dataSource={filteredMenuData}
          columns={menuColumns}
        />
      </Row>

      <Modal
        title={editingMenu ? '编辑菜单' : '添加新菜单'}
        open={modalOpen}
        okText="保存"
        cancelText="取消"
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={menuForm} layout="vertical">
          <Form.Item
            label="类别"
            name="category"
            rules={[{ required: true, message: '请输入类别' }]}
          >
            <Input placeholder="请输入类别" />
          </Form.Item>
          <Form.Item
            label="种类个数"
            name="kindCount"
            rules={[{ required: true, message: '请输入种类个数' }]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default MenuManagePage
