import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MerchantLogin.css'

type LoginFormValues = {
  account: string
  password: string
}

const MERCHANT_ACCOUNT = 'merchant'
const MERCHANT_PASSWORD = '123456'

function MerchantLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSubmit = (values: LoginFormValues) => {
    if (
      values.account === MERCHANT_ACCOUNT &&
      values.password === MERCHANT_PASSWORD
    ) {
      setError('')
      navigate('/home/users', { replace: true })
      return
    }

    setError('账号或密码错误')
  }

  return (
    <main className="merchant-login-page">
      <section className="login-hero">
        <div className="login-brand">C</div>
        <Typography.Text className="login-system-name">
          餐厅点餐系统
        </Typography.Text>
        <Typography.Title level={1}>商家管理端</Typography.Title>
        <Typography.Paragraph>
          管理菜品、订单和顾客评价，及时处理顾客点餐需求。
        </Typography.Paragraph>
      </section>

      <section className="login-panel" aria-label="商家登录">
        <Card className="login-card" bordered={false}>
          <div className="login-heading">
            <Typography.Title level={2}>商家登录</Typography.Title>
            <Typography.Paragraph>请输入商家账号和密码</Typography.Paragraph>
          </div>

          <Form<LoginFormValues>
            layout="vertical"
            size="large"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="账号"
              name="account"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input placeholder="请输入账号" autoComplete="username" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </Form.Item>

            {error && (
              <Alert
                className="login-error"
                message={error}
                type="error"
                showIcon
              />
            )}

            <Button block htmlType="submit" type="primary">
              登录
            </Button>
          </Form>

          <Typography.Text className="login-tip">
            测试账号：merchant / 123456
          </Typography.Text>
        </Card>
      </section>
    </main>
  )
}

export default MerchantLogin
