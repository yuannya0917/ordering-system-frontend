import { Button, Col, Form, Input, Row, Space, Table, message } from 'antd'
import type { TableColumnsType, TablePaginationConfig } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllUsers, queryUsers } from '../../api/user-account'
import type { QueryUsersParams, UserAccount } from '../../api/user-account'

type SearchValues = {
  userId?: string
  username?: string
}

const CURRENT_USER_ID = 'root1'
const DEFAULT_PAGE_SIZE = 10

function normalizeSearchValues(values: SearchValues) {
  return {
    userId: values.userId?.trim() || undefined,
    username: values.username?.trim() || undefined,
  }
}

function UserAccountPage() {
  const [form] = Form.useForm<SearchValues>()
  const [users, setUsers] = useState<UserAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  })

  const columns = useMemo<TableColumnsType<UserAccount>>(
    () => [
      { title: '用户ID', dataIndex: 'userId' },
      { title: '用户名', dataIndex: 'username' },
      {
        title: '消费总额',
        dataIndex: 'totalAmount',
        render: (value: number) => value ?? 0,
      },
      {
        title: '订单数量',
        dataIndex: 'orderCount',
        render: (value: number) => value ?? 0,
      },
    ],
    [],
  )

  const fetchAllUsers = useCallback(async () => {
    setLoading(true)

    try {
      const data = await getAllUsers({ currentUserId: CURRENT_USER_ID })

      setUsers(data)
      setPagination((previous) => ({
        ...previous,
        current: 1,
        total: data.length,
      }))
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchQueryUsers = useCallback(
    async (values: SearchValues, page = 1, pageSize = DEFAULT_PAGE_SIZE) => {
      const searchValues = normalizeSearchValues(values)

      if (!searchValues.userId && !searchValues.username) {
        await fetchAllUsers()
        return
      }

      setLoading(true)

      try {
        const params: QueryUsersParams = {
          currentUserId: CURRENT_USER_ID,
          page,
          pageSize,
          ...searchValues,
        }
        const data = await queryUsers(params)

        setUsers(data.records)
        setPagination({
          current: data.current || page,
          pageSize: data.size || pageSize,
          total: data.total || data.records.length,
        })
      } catch (error) {
        message.error(error instanceof Error ? error.message : '查询用户失败')
      } finally {
        setLoading(false)
      }
    },
    [fetchAllUsers],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchAllUsers()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [fetchAllUsers])

  const handleSearch = (values: SearchValues) => {
    void fetchQueryUsers(values, 1, pagination.pageSize || DEFAULT_PAGE_SIZE)
  }

  const handleReset = () => {
    form.resetFields()
    void fetchAllUsers()
  }

  const handleTableChange = (nextPagination: TablePaginationConfig) => {
    void fetchQueryUsers(
      form.getFieldsValue(),
      nextPagination.current || 1,
      nextPagination.pageSize || DEFAULT_PAGE_SIZE,
    )
  }

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={form} onFinish={handleSearch} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col style={{ display: 'flex' }}>
              <Space size={20}>
                <Form.Item label="用户ID" name="userId">
                  <Input allowClear placeholder="请输入用户ID" />
                </Form.Item>
                <Form.Item label="用户名" name="username">
                  <Input allowClear placeholder="请输入用户名" />
                </Form.Item>
              </Space>
            </Col>

            <Col>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Row>
      <Row style={{ width: '100%' }}>
        <Table<UserAccount>
          rowKey="userId"
          style={{ width: '100%' }}
          loading={loading}
          dataSource={users}
          columns={columns}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Row>
    </>
  )
}

export default UserAccountPage
