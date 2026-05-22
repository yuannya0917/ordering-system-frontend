import { Button, Col, Form, Input, Popconfirm, Row, Space, Table, Typography, message } from 'antd'
import type { TableColumnsType } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { deleteComment } from '../../api/comment-manage'

type CommentRecord = {
  key: string
  commentId: string
  orderId: string
  userId: string
  content: string
  publishTime: string
}

type SearchValues = {
  content?: string
  orderId?: string
}

const initialCommentData: CommentRecord[] = [
  {
    key: 'cmt17345678901',
    commentId: 'cmt17345678901',
    orderId: 'order01',
    userId: 'user01',
    content: '味道非常好！',
    publishTime: '2026-05-16T23:30:00',
  },
]

function formatPublishTime(publishTime: string) {
  return publishTime.replace('T', ' ')
}

function createCommentColumns(onDelete: (record: CommentRecord) => void): TableColumnsType<CommentRecord> {
  return [
    { title: '评论ID', dataIndex: 'commentId', width: 170 },
    { title: '订单ID', dataIndex: 'orderId', width: 140 },
    { title: '用户ID', dataIndex: 'userId', width: 140 },
    {
      title: '评论内容',
      dataIndex: 'content',
      render: (content: string) => <Typography.Text>{content}</Typography.Text>,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      width: 180,
      render: (publishTime: string) => (
        <Typography.Text type="secondary">{formatPublishTime(publishTime)}</Typography.Text>
      ),
    },
    {
      title: '操作',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确认删除该评论吗？"
          okText="确认"
          cancelText="取消"
          onConfirm={() => onDelete(record)}
        >
          <Button size="small" danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ]
}

function CommentManagePage() {
  const [form] = Form.useForm<SearchValues>()
  const [searchValues, setSearchValues] = useState<SearchValues>({})
  const [commentData, setCommentData] = useState<CommentRecord[]>(initialCommentData)

  const filteredCommentData = useMemo(() => {
    const content = searchValues.content?.trim().toLowerCase()
    const orderId = searchValues.orderId?.trim().toLowerCase()

    return commentData.filter((comment) => {
      const matchContent = !content || comment.content.toLowerCase().includes(content)
      const matchOrderId = !orderId || comment.orderId.toLowerCase().includes(orderId)

      return matchContent && matchOrderId
    })
  }, [commentData, searchValues])

  const handleReset = () => {
    form.resetFields()
    setSearchValues({})
  }

  const handleDelete = useCallback(async (record: CommentRecord) => {
    if (!record.commentId || !record.userId) {
      message.error('参数不完整')
      return
    }

    try {
      const result = await deleteComment({
        commentId: record.commentId,
        userId: record.userId,
      })

      if (!result.success) {
        message.error(result.message || '删除失败，评论不存在或无权删除')
        return
      }

      setCommentData((data) => data.filter((comment) => comment.commentId !== record.commentId))
      message.success(result.message || '删除成功')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '删除评论失败')
    }
  }, [])

  const commentColumns = useMemo(() => createCommentColumns(handleDelete), [handleDelete])

  return (
    <>
      <Row style={{ width: '100%', marginBottom: 16 }}>
        <Form form={form} onFinish={setSearchValues} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Col>
              <Space>
                <Form.Item style={{ marginBottom: 0 }} label="评论内容" name="content">
                  <Input allowClear placeholder="请输入评论内容" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }} label="订单ID" name="orderId">
                  <Input allowClear placeholder="请输入订单ID" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Row>

      <Row style={{ width: '100%' }}>
        <Table<CommentRecord>
          rowKey="commentId"
          style={{ width: '100%' }}
          dataSource={filteredCommentData}
          columns={commentColumns}
        />
      </Row>
    </>
  )
}

export default CommentManagePage
