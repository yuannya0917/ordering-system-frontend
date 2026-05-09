import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/login'
import './MerchantLogin.css'

type LoginFormValues = {
  account: string
  password: string
}

function MerchantLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: LoginFormValues) => {
    setError('')
    setLoading(true)

    try {
      const result = await login({
        userId: values.account,
        userPassword: values.password,
      })

      if (result.userType !== 'admin') {
        setError('当前账号不是商家账号')
        return
      }

      setError('')
      navigate('/home/users', { replace: true })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '账号或密码错误')
    } finally {
      setLoading(false)
    }
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

            <Button block htmlType="submit" type="primary" loading={loading}>
              登录
            </Button>
          </Form>
        </Card>
      </section>
    </main>
  )
}

export default MerchantLogin
