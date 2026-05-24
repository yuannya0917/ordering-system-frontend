export { API_BASE_URL } from '../config'
export { api, request } from './request'
export { login } from './login'
export type { LoginParams, LoginResult, UserType as LoginUserType } from './login'
export { getAllUsers, queryUsers } from './user-account'
export { addMenu, deleteMenu, getMenuList, updateMenu } from './menu-management'
export { addDish, deleteDish, getDishList, updateDish } from './cuisine-manage'
export { deleteComment } from './comment-manage'
export { getAllOrders, getOrderDetails, updateOrderStatus } from './order-manage'
export { getDishImage, uploadDishImage } from './pic'
export { getTotalAmount } from './revenue'
export type {
  GetAllUsersParams,
  QueryUsersParams,
  QueryUsersResult,
  UserAccount,
} from './user-account'
export type {
  AddMenuParams,
  DeleteMenuParams,
  GetMenuListParams,
  MenuItem,
  UpdateMenuParams,
} from './menu-management'
export type {
  AddDishParams,
  DeleteDishParams,
  DishItem,
  GetDishListParams,
  UpdateDishParams,
} from './cuisine-manage'
export type { DeleteCommentParams, DeleteCommentResult } from './comment-manage'
export type {
  GetAllOrdersParams,
  OrderDetailItem,
  OrderItem,
  OrderStatusCode,
  UpdateOrderStatusParams,
} from './order-manage'
export type { DishImage, UploadDishImageParams } from './pic'
export type { GetTotalAmountParams, TotalAmountResult } from './revenue'
