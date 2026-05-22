import { api } from '../request'

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
