import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../../api/login'
import { useAuth } from '../../store/useAuth'
import './MerchantLogin.css'

type LoginFormValues = {
  account: string
  password: string
}

function MerchantLogin() {
  const navigate = useNavigate()
  const { isLoggedIn, login, logout } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home/users', { replace: true })
    }
  }, [isLoggedIn, navigate])

  const handleSubmit = async (values: LoginFormValues) => {
    setError('')
    setLoading(true)
    const account = values.account.trim()

    try {
      const result = await loginRequest({
        userId: account,
        userPassword: values.password,
      })

      if (result.userType !== 'admin') {
        logout()
        setError('当前账号不是商家账号')
        return
      }

      login(result.userId || account, result.userType)
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
      <div className="login-title-block">
        <Typography.Title level={1}>美味餐厅</Typography.Title>
      </div>


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

            <Button block htmlType="submit" type="primary" loading={loading} danger>
              登录
            </Button>
          </Form>
        </Card>
      </section>
    </main>
  )
}

export default MerchantLogin
