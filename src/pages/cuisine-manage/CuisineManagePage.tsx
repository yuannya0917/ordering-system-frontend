import { Button, Col, Form, Input, Popconfirm, Row, Space, Table, message } from 'antd'
import type { TableColumnsType } from 'antd'
import { useMemo, useState } from 'react'
import { addDish, deleteDish, updateDish } from '../../api/cuisine-manage'
import type { AddDishParams } from '../../api/cuisine-manage'
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
    key: 'dish001',
    dishId: 'dish001',
    dishName: '招牌黑椒牛柳饭',
    dishPrice: 32,
    dishIntroduction: '黑椒浓香，牛柳鲜嫩',
    menuId: 'menu1',
  },
  {
    key: 'dish002',
    dishId: 'dish002',
    dishName: '番茄肥牛面',
    dishPrice: 29,
    dishIntroduction: '酸甜浓汤搭配肥牛',
    menuId: 'menu1',
  },
  {
    key: 'dish003',
    dishId: 'dish003',
    dishName: '柠檬气泡茶',
    dishPrice: 15,
    dishIntroduction: '清爽解腻',
    menuId: 'menu2',
  },
]

function CuisineManagePage() {
  const [form] = Form.useForm<SearchValues>()
  const [searchValues, setSearchValues] = useState<SearchValues>({})
  const [cuisineData, setCuisineData] = useState<CuisineRecord[]>(initialCuisineData)
  const [editingCuisine, setEditingCuisine] = useState<CuisineRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const filteredCuisineData = useMemo(() => {
    const cuisineName = searchValues.cuisineName?.trim().toLowerCase()

    return cuisineData.filter((cuisine) => {
      return !cuisineName || cuisine.dishName.toLowerCase().includes(cuisineName)
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

  const handleDelete = async (dishId: string) => {
    try {
      await deleteDish({ dishId })
      setCuisineData((data) => data.filter((cuisine) => cuisine.dishId !== dishId))
      message.success('删除成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除菜品失败')
    }
  }

  const handleSubmit = async (values: CuisineFormValues) => {
    const params: AddDishParams = {
      dishId: values.dishId,
      dishName: values.dishName,
      dishPrice: String(values.dishPrice),
      dishIntroduction: values.dishIntroduction?.trim() || undefined,
      menuId: values.menuId,
    }

    if (editingCuisine) {
      setSaving(true)
      try {
        await updateDish(params)
        setCuisineData((data) =>
          data.map((cuisine) =>
            cuisine.key === editingCuisine.key
              ? { ...values, dishIntroduction: params.dishIntroduction, key: values.dishId }
              : cuisine,
          ),
        )
        setModalOpen(false)
        message.success('编辑成功')
      } catch (error) {
        message.error(error instanceof Error ? error.message : '修改菜品失败')
      } finally {
        setSaving(false)
      }
      return
    }

    setSaving(true)
    try {
      await addDish(params)
      setCuisineData((data) => [
        ...data,
        {
          ...values,
          dishIntroduction: params.dishIntroduction,
          key: values.dishId,
        },
      ])
      setModalOpen(false)
      message.success('添加成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '添加菜品失败')
    } finally {
      setSaving(false)
    }
  }

  const cuisineColumns: TableColumnsType<CuisineRecord> = [
    { title: '菜品ID', dataIndex: 'dishId' },
    { title: '菜品名称', dataIndex: 'dishName' },
    {
      title: '菜品价格',
      dataIndex: 'dishPrice',
      render: (price: number) => `￥${price.toFixed(2)}`,
    },
    { title: '菜品介绍', dataIndex: 'dishIntroduction' },
    { title: '所属菜单ID', dataIndex: 'menuId' },
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
            onConfirm={() => handleDelete(record.dishId)}
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
        <Table<CuisineRecord>
          rowKey="key"
          style={{ width: '100%' }}
          dataSource={filteredCuisineData}
          columns={cuisineColumns}
        />
      </Row>

      <CuisineFormModal
        open={modalOpen}
        title={editingCuisine ? '编辑菜品' : '添加新菜品'}
        initialValues={editingCuisine ?? undefined}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        confirmLoading={saving}
        dishIdDisabled={Boolean(editingCuisine)}
      />
    </>
  )
}

export default CuisineManagePage

