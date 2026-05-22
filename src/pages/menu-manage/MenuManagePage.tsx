import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
} from 'antd'
import type { TableColumnsType } from 'antd'
import { useMemo, useState } from 'react'
import { addMenu, deleteMenu, updateMenu } from '../../api/menu-management'
import type { AddMenuParams, UpdateMenuParams } from '../../api/menu-management'

type MenuRecord = AddMenuParams & {
  key: string
}

type SearchValues = {
  menuName?: string
}

type MenuFormValues = {
  menuId: string
  menuName: string
  remark?: string
}

const initialMenuData: MenuRecord[] = [
  {
    key: 'menu1',
    menuId: 'menu1',
    menuName: '主食',
    remark: '米饭、面食等',
    createTime: '2026-05-16T22:30:00',
  },
  {
    key: 'menu2',
    menuId: 'menu2',
    menuName: '饮品',
    remark: '冷热饮品',
    createTime: '2026-05-16T22:30:00',
  },
  {
    key: 'menu3',
    menuId: 'menu3',
    menuName: '小吃',
    remark: '餐前小食',
    createTime: '2026-05-16T22:30:00',
  },
]

function formatLocalDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function MenuManagePage() {
  const [searchForm] = Form.useForm<SearchValues>()
  const [menuForm] = Form.useForm<MenuFormValues>()
  const [searchValues, setSearchValues] = useState<SearchValues>({})
  const [menuData, setMenuData] = useState<MenuRecord[]>(initialMenuData)
  const [editingMenu, setEditingMenu] = useState<MenuRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const filteredMenuData = useMemo(() => {
    const menuName = searchValues.menuName?.trim().toLowerCase()

    return menuData.filter((menu) => {
      return !menuName || menu.menuName.toLowerCase().includes(menuName)
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
      menuId: menu.menuId,
      menuName: menu.menuName,
      remark: menu.remark,
    })
    setModalOpen(true)
  }

  const handleDelete = async (menuId: string) => {
    try {
      await deleteMenu({ menuId })
      setMenuData((data) => data.filter((menu) => menu.menuId !== menuId))
      message.success('删除成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除菜单失败')
    }
  }

  const handleModalOk = async () => {
    const values = await menuForm.validateFields()

    if (editingMenu) {
      const params: UpdateMenuParams = {
        menuId: values.menuId,
        menuName: values.menuName,
        remark: values.remark?.trim() || undefined,
      }

      setSaving(true)
      try {
        await updateMenu(params)
        setMenuData((data) =>
          data.map((menu) => (menu.key === editingMenu.key ? { ...menu, ...params } : menu)),
        )
        setModalOpen(false)
        message.success('编辑成功')
      } catch (error) {
        message.error(error instanceof Error ? error.message : '修改菜单失败')
      } finally {
        setSaving(false)
      }
      return
    }

    const params: AddMenuParams = {
      ...values,
      remark: values.remark?.trim() || undefined,
      createTime: formatLocalDateTime(new Date()),
    }

    setSaving(true)
    try {
      await addMenu(params)
      setMenuData((data) => [
        ...data,
        {
          key: params.menuId,
          ...params,
        },
      ])
      setModalOpen(false)
      message.success('添加成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '添加菜单失败')
    } finally {
      setSaving(false)
    }
  }

  const menuColumns: TableColumnsType<MenuRecord> = [
    { title: '菜单ID', dataIndex: 'menuId' },
    { title: '菜单名称', dataIndex: 'menuName' },
    { title: '备注', dataIndex: 'remark' },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '操作',
      render: (_value, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该菜单吗？"
            okText="确认"
            cancelText="取消"
            onConfirm={() => handleDelete(record.menuId)}
          >
            <Button size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={searchForm} onFinish={setSearchValues} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col style={{ display: 'flex' }}>
              <Space>
                <Form.Item style={{ marginBottom: 0 }} label="菜单名称" name="menuName">
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
        <Table<MenuRecord>
          rowKey="key"
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
        confirmLoading={saving}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      >
        <Form form={menuForm} layout="vertical">
          <Form.Item
            label="菜单ID"
            name="menuId"
            rules={[{ required: true, message: '请输入菜单ID' }]}
          >
            <Input disabled={Boolean(editingMenu)} placeholder="请输入菜单ID" />
          </Form.Item>
          <Form.Item
            label="菜单名称"
            name="menuName"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default MenuManagePage
