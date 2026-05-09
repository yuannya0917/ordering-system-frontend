import { CoffeeOutlined } from '@ant-design/icons'
import { Button, Col, Form, Image, Input, Popconfirm, Row, Space, Table, message } from 'antd'
import type { TableColumnsType } from 'antd'
import { useMemo, useState } from 'react'
import CuisineFormModal from './CuisineFormModal'
import type { CuisineFormValues } from './CuisineFormModal'

type CuisineRecord = CuisineFormValues & {
  key: string
}

type SearchValues = {
  cuisineName?: string
}

const initialCuisineData: CuisineRecord[] = [
  {
    key: '1',
    cover: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=160&q=80',
    name: '招牌黑椒牛柳饭',
    category: '主食',
    price: 32,
    stock: 48,
  },
  {
    key: '2',
    cover: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=160&q=80',
    name: '番茄肥牛面',
    category: '主食',
    price: 29,
    stock: 32,
  },
  {
    key: '3',
    cover: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=160&q=80',
    name: '柠檬气泡茶',
    category: '饮品',
    price: 15,
    stock: 76,
  },
]

function CuisineManagePage() {
  const [form] = Form.useForm<SearchValues>()
  const [searchValues, setSearchValues] = useState<SearchValues>({})
  const [cuisineData, setCuisineData] = useState<CuisineRecord[]>(initialCuisineData)
  const [editingCuisine, setEditingCuisine] = useState<CuisineRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredCuisineData = useMemo(() => {
    const cuisineName = searchValues.cuisineName?.trim().toLowerCase()

    return cuisineData.filter((cuisine) => {
      return !cuisineName || cuisine.name.toLowerCase().includes(cuisineName)
    })
  }, [cuisineData, searchValues])

  const handleReset = () => {
    form.resetFields()
    setSearchValues({})
  }

  const handleAdd = () => {
    setEditingCuisine(null)
    setModalOpen(true)
  }

  const handleEdit = (record: CuisineRecord) => {
    setEditingCuisine(record)
    setModalOpen(true)
  }

  const handleDelete = (key: string) => {
    setCuisineData((data) => data.filter((cuisine) => cuisine.key !== key))
    message.success('删除成功')
  }

  const handleSubmit = (values: CuisineFormValues) => {
    if (editingCuisine) {
      setCuisineData((data) =>
        data.map((cuisine) =>
          cuisine.key === editingCuisine.key ? { ...cuisine, ...values } : cuisine,
        ),
      )
      message.success('编辑成功')
    } else {
      setCuisineData((data) => [
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

  const cuisineColumns: TableColumnsType<CuisineRecord> = [
    {
      title: '封面',
      dataIndex: 'cover',
      render: (cover: string) =>
        cover ? (
          <Image
            width={56}
            height={56}
            src={cover}
            style={{ borderRadius: 4, objectFit: 'cover' }}
            preview={false}
          />
        ) : (
          <CoffeeOutlined style={{ fontSize: 40 }} />
        ),
    },
    { title: '菜品名称', dataIndex: 'name' },
    { title: '类别', dataIndex: 'category' },
    {
      title: '价格',
      dataIndex: 'price',
      render: (price: number) => `￥${price.toFixed(2)}`,
    },
    { title: '库存', dataIndex: 'stock' },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该菜品吗？"
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

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={form} onFinish={setSearchValues} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col>
              <Space>
                <Form.Item style={{ marginBottom: 0 }} label="菜品名称" name="cuisineName">
                  <Input allowClear placeholder="请输入菜品名称" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>

            <Col>
              <Button type="primary" onClick={handleAdd}>
                添加新菜品
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>

      <Row style={{ width: '100%' }}>
        <Table style={{ width: '100%' }} dataSource={filteredCuisineData} columns={cuisineColumns} />
      </Row>

      <CuisineFormModal
        open={modalOpen}
        title={editingCuisine ? '编辑菜品' : '添加新菜品'}
        initialValues={editingCuisine ?? undefined}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default CuisineManagePage
