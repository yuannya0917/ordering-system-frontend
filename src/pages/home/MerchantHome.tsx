import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/useAuth'
import './MerchantHome.css'

type MenuKey = 'users' | 'menu' | 'menu-cuisine' | 'orders' | 'comments' | 'revenue'

const menuLabels: Record<MenuKey, string> = {
  users: '用户账户查询',
  menu: '管理菜单',
  'menu-cuisine': '管理菜品',
  orders: '订单管理系统',
  comments: '评论管理系统',
  revenue: '查看营业额',
}

function getActiveKey(pathname: string): MenuKey {
  if (pathname.endsWith('/home/menu/cuisine')) {
    return 'menu-cuisine'
  }

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
  const { logout, userId } = useAuth()
  const activeKey = useMemo(() => getActiveKey(location.pathname), [location.pathname])
  const defaultOpenKeys = activeKey === 'menu' || activeKey === 'menu-cuisine' ? ['menu-page'] : []
  const menuItems = useMemo<MenuProps['items']>(
    () => [
      { key: 'users', label: menuLabels.users },
      {
        key: 'menu-page',
        label: <span onClick={() => navigate('/home/menu')}>管理菜单页面</span>,
        children: [
          { key: 'menu', label: menuLabels.menu },
          { key: 'menu-cuisine', label: menuLabels['menu-cuisine'] },
        ],
      },
      { key: 'orders', label: menuLabels.orders },
      { key: 'comments', label: menuLabels.comments },
      { key: 'revenue', label: menuLabels.revenue },
    ],
    [navigate],
  )

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'menu-cuisine') {
      navigate('/home/menu/cuisine')
      return
    }

    navigate(`/home/${key}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

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
            <Typography.Text type="secondary">账号：{userId}</Typography.Text>
          </div>
          <Button onClick={handleLogout} danger>
            退出登录
          </Button>
        </Space>
      </Layout.Header>

      <Layout className="merchant-main-block">
        <Layout.Sider className="merchant-sidebar" width={220}>
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            defaultOpenKeys={defaultOpenKeys}
            items={menuItems}
            onClick={handleMenuClick}
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
