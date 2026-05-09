import { Navigate, createBrowserRouter } from 'react-router-dom'
import CommentManagePage from '../pages/comment-manage/CommentManagePage'
import MerchantHome from '../pages/home/MerchantHome'
import MenuManagePage from '../pages/menu-manage/MenuManagePage'
import OrderManagePage from '../pages/order-manage/OrderManagePage'
import RevenuePage from '../pages/revenue/RevenuePage'
import UserAccountPage from '../pages/user-account/UserAccountPage'
import MerchantLogin from '../pages/login/MerchantLogin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <MerchantLogin />,
  },
  {
    path: '/home',
    element: <MerchantHome />,
    children: [
      {
        index: true,
        element: <Navigate to="/home/users" replace />,
      },
      {
        path: 'users',
        element: <UserAccountPage />,
      },
      {
        path: 'menu',
        element: <MenuManagePage />,
      },
      {
        path: 'orders',
        element: <OrderManagePage />,
      },
      {
        path: 'comments',
        element: <CommentManagePage />,
      },
      {
        path: 'revenue',
        element: <RevenuePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

export default router
