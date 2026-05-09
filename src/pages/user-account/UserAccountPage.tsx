import { Button, Col, Form, Input, Row, Space, Table } from 'antd'
import { useMemo, useState } from 'react'

type UserStatus = '正常' | '停用'

type UserRecord = {
  key: string
  account: string
  uid: string
}

type SearchValues = {
  account?: string
  uid?: string
  status?: UserStatus
}

const userData: UserRecord[] = [
  { key: '1', account: 'customer001', uid: '138****1024'},
  { key: '2', account: 'customer002', uid: '136****7788'},
  { key: '3', account: 'customer003', uid: '159****2366'},
]

function UserAccountPage() {
  const [form] = Form.useForm<SearchValues>()
  const [searchValues, setSearchValues] = useState<SearchValues>({})

  const useAccountColumns=[
            { title: '账号', dataIndex: 'account' },
            { title: 'UID', dataIndex: 'uid' },
        ]

  const filteredUserData = useMemo(() => {
    const account = searchValues.account?.trim().toLowerCase()
    const uid = searchValues.uid?.trim()

    return userData.filter((user) => {
      const matchAccount = !account || user.account.toLowerCase().includes(account)
      const matchPhone = !uid || user.uid.includes(uid)

      return matchAccount && matchPhone
    })
  }, [searchValues])

  const handleReset = () => {
    form.resetFields()
    setSearchValues({})
  }

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={form}  onFinish={setSearchValues} style={{width:'100%'}}>
          <Row justify='space-between'>
            <Col style={{ display: 'flex' }}>
              <Space size={20}>
                <Form.Item label="账号" name="account">
                  <Input allowClear placeholder="请输入账号" />
                </Form.Item>
                <Form.Item label="UID" name="uid">
                  <Input allowClear placeholder="请输入UID" />
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
        <Table
          style={{ width: '100%' }}
          dataSource={filteredUserData}
          columns={useAccountColumns}
        />
      </Row>
    </>
  )
}

export default UserAccountPage
