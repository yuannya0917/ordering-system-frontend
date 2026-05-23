import { Button, Col, Form, Image, Input, Popconfirm, Row, Space, Table, message } from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useState } from 'react'
import { addDish, deleteDish, getDishList, updateDish } from '../../api/cuisine-manage'
import type { AddDishParams, DishItem } from '../../api/cuisine-manage'
import { getMenuList } from '../../api/menu-management'
import { uploadDishImage } from '../../api/pic'
import CuisineFormModal from './CuisineFormModal'
import type { CuisineFormValues } from './CuisineFormModal'

type CuisineRecord = Omit<DishItem, 'dishIntroduction' | 'menuId'> & {
  key: string
  dishIntroduction?: string
  menuId: string
}

type SearchValues = {
  dishId?: string
  dishName?: string
  menuId?: string
}

type MenuOption = {
  label: string
  value: string
}

function normalizeSearchValues(values: SearchValues) {
  return {
    dishId: values.dishId?.trim() || undefined,
    dishName: values.dishName?.trim() || undefined,
    menuId: values.menuId?.trim() || undefined,
  }
}

function toCuisineRecords(data: DishItem[]): CuisineRecord[] {
  return data.map((dish) => ({
    ...dish,
    dishIntroduction: dish.dishIntroduction ?? undefined,
    key: dish.dishId,
    menuId: dish.menuId ?? '',
  }))
}

function getDishImageUrl(dishImage?: string | null) {
  if (!dishImage) {
    return ''
  }

  return dishImage
}

function CuisineManagePage() {
  const [form] = Form.useForm<SearchValues>()
  const [cuisineData, setCuisineData] = useState<CuisineRecord[]>([])
  const [editingCuisine, setEditingCuisine] = useState<CuisineRecord | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([])
  const [menuOptionsLoading, setMenuOptionsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchDishList = async () => {
      setLoading(true)

      try {
        const data = await getDishList()
        setCuisineData(toCuisineRecords(data))
      } catch (error) {
        message.error(error instanceof Error ? error.message : '获取菜品列表失败')
      } finally {
        setLoading(false)
      }
    }

    void fetchDishList()
  }, [])

  const handleSearch = async (values: SearchValues) => {
    setLoading(true)

    try {
      const data = await getDishList(normalizeSearchValues(values))
      setCuisineData(toCuisineRecords(data))
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取菜品列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.resetFields()
    void handleSearch({})
  }

  const fetchMenuOptions = async () => {
    setMenuOptionsLoading(true)

    try {
      const data = await getMenuList()
      setMenuOptions(
        data.map((menu) => ({
          label: menu.menuName ? `${menu.menuName}（${menu.menuId}）` : menu.menuId,
          value: menu.menuId,
        })),
      )
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取菜单列表失败')
    } finally {
      setMenuOptionsLoading(false)
    }
  }

  const handleAdd = async () => {
    setEditingCuisine(null)
    await fetchMenuOptions()
    setModalOpen(true)
  }

  const handleEdit = async (record: CuisineRecord) => {
    setEditingCuisine(record)
    await fetchMenuOptions()
    setModalOpen(true)
  }

  const handleDelete = async (dishId: string) => {
    try {
      await deleteDish({ dishId })
      await handleSearch(form.getFieldsValue())
      message.success('删除成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除菜品失败')
    }
  }

  const handleSubmit = async (values: CuisineFormValues) => {
    const imageFile = values.coverFile?.[0]?.originFileObj
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
        if (imageFile) {
          await uploadDishImage({
            dishId: values.dishId,
            dishName: values.dishName,
            file: imageFile,
          })
        }
        await handleSearch(form.getFieldsValue())
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
      if (imageFile) {
        await uploadDishImage({
          dishId: values.dishId,
          dishName: values.dishName,
          file: imageFile,
        })
      }
      await handleSearch(form.getFieldsValue())
      setModalOpen(false)
      message.success('添加成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '添加菜品失败')
    } finally {
      setSaving(false)
    }
  }

  const cuisineColumns: TableColumnsType<CuisineRecord> = [
    {
      title: '菜品封面',
      dataIndex: 'dishImage',
      render: (dishImage: string | null | undefined) => {
        const imageUrl = getDishImageUrl(dishImage)

        return imageUrl ? (
          <Image
            src={imageUrl}
            alt="菜品封面"
            width={64}
            height={48}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          '-'
        )
      },
    },
    { title: '菜品ID', dataIndex: 'dishId' },
    { title: '菜品名称', dataIndex: 'dishName' },
    {
      title: '菜品价格',
      dataIndex: 'dishPrice',
      render: (price: number) => `¥${Number(price || 0).toFixed(2)}`,
    },
    { title: '菜品介绍', dataIndex: 'dishIntroduction' },
    { title: '所属菜单', dataIndex: 'menuName' },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)} danger>
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
        <Form form={form} onFinish={handleSearch} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col>
              <Space>
                <Form.Item style={{ marginBottom: 0 }} label="菜品ID" name="dishId">
                  <Input allowClear placeholder="请输入菜品ID" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }} label="菜品名称" name="dishName">
                  <Input allowClear placeholder="请输入菜品名称" />
                </Form.Item>
                <Button type="primary" htmlType="submit" danger>
                  查询
                </Button>
                <Button onClick={handleReset} danger>
                  重置
                </Button>
              </Space>
            </Col>

            <Col>
              <Button type="primary" onClick={handleAdd} danger>
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
          loading={loading}
          dataSource={cuisineData}
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
        menuOptions={menuOptions}
        menuOptionsLoading={menuOptionsLoading}
        dishIdDisabled={Boolean(editingCuisine)}
      />
    </>
  )
}

export default CuisineManagePage
