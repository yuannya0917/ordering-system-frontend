import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './MerchantHome.css'

type MenuKey = 'users' | 'menu' | 'orders' | 'comments' | 'revenue'

const menuLabels: Record<MenuKey, string> = {
  users: '用户账户查询',
  menu: '管理菜单页面',
  orders: '订单管理系统',
  comments: '评论管理系统',
  revenue: '查看营业额',
}

const menuItems: MenuProps['items'] = [
  { key: 'users', label: menuLabels.users },
  { key: 'menu', label: menuLabels.menu },
  { key: 'orders', label: menuLabels.orders },
  { key: 'comments', label: menuLabels.comments },
  { key: 'revenue', label: menuLabels.revenue },
]

function getActiveKey(pathname: string): MenuKey {
  const current = pathname.split('/').pop()

  if (
    current === 'users' ||
    current === 'menu' ||
    current === 'orders' ||
    current === 'comments' ||
    current === 'revenue'
  ) {
    return current
  }

  return 'users'
}

function MerchantHome() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = useMemo(() => getActiveKey(location.pathname), [location.pathname])

  return (
    <Layout className="merchant-home-layout">
      <Layout.Header className="merchant-topbar">
        <Typography.Title className="merchant-page-title" level={1}>
          {menuLabels[activeKey]}
        </Typography.Title>

        <Space className="merchant-user-area" size={16}>
          <Avatar className="merchant-avatar"></Avatar>
          <div className="merchant-user-text">
            <Typography.Text strong>云上餐厅管理员</Typography.Text>
            <Typography.Text type="secondary">账号：merchant</Typography.Text>
          </div>
          <Button onClick={() => navigate('/login', { replace: true })}>
            退出登录
          </Button>
        </Space>
      </Layout.Header>

      <Layout className="merchant-main-block">
        <Layout.Sider className="merchant-sidebar" width={220}>
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={({ key }) => navigate(`/home/${key}`)}
          />
        </Layout.Sider>

        <Layout.Content className="merchant-content">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default MerchantHome
