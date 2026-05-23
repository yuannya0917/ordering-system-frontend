import { api } from '../request'

export type CommentItem = {
  commentId: string
  orderId: string
  userId: string
  content: string
  publishTime: string
}

export type DeleteCommentParams = {
  commentId: string
  userId: string
}

export type DeleteCommentResult = {
  success: boolean
  message: string
}

export function deleteComment(params: DeleteCommentParams) {
  return api.delete<DeleteCommentResult>('/comment/delete', { params })
}

export function getAllComments() {
  return api.get<CommentItem[]>('/comment/admin/list')
}
