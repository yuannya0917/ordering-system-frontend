import { Button, Col, Form, Input, Popconfirm, Row, Space, Table, Typography, message } from 'antd'
import type { TableColumnsType } from 'antd'
import { useMemo, useState } from 'react'

type CommentRecord = {
  key: string
  content: string
  cuisineName: string
  commentTime: string
}

type SearchValues = {
  content?: string
  cuisineName?: string
}

const initialCommentData: CommentRecord[] = [
  {
    key: '1',
    content: '味道很好，出餐也快。',
    cuisineName: '招牌黑椒牛柳饭',
    commentTime: '2026-05-09 12:45',
  },
  {
    key: '2',
    content: '希望下次可以少一点冰。',
    cuisineName: '柠檬气泡茶',
    commentTime: '2026-05-09 13:08',
  },
  {
    key: '3',
    content: '汤底不错，分量合适。',
    cuisineName: '番茄肥牛面',
    commentTime: '2026-05-09 13:26',
  },
]

function createCommentColumns(onDelete: (key: string) => void): TableColumnsType<CommentRecord> {
  return [
    {
      title: '评论内容',
      dataIndex: 'content',
      render: (content: string) => <Typography.Text>{content}</Typography.Text>,
    },
    { title: '菜品名称', dataIndex: 'cuisineName', width: 180 },
    {
      title: '评论时间',
      dataIndex: 'commentTime',
      width: 170,
      render: (commentTime: string) => (
        <Typography.Text type="secondary">{commentTime}</Typography.Text>
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
          onConfirm={() => onDelete(record.key)}
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
    const cuisineName = searchValues.cuisineName?.trim().toLowerCase()

    return commentData.filter((comment) => {
      const matchContent = !content || comment.content.toLowerCase().includes(content)
      const matchCuisineName =
        !cuisineName || comment.cuisineName.toLowerCase().includes(cuisineName)

      return matchContent && matchCuisineName
    })
  }, [commentData, searchValues])

  const handleReset = () => {
    form.resetFields()
    setSearchValues({})
  }

  const handleDelete = (key: string) => {
    setCommentData((data) => data.filter((comment) => comment.key !== key))
    message.success('删除成功')
  }

  const commentColumns = useMemo(() => createCommentColumns(handleDelete), [])

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
                <Form.Item style={{ marginBottom: 0 }} label="菜品名称" name="cuisineName">
                  <Input allowClear placeholder="请输入菜品名称" />
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
        <Table
          style={{ width: '100%' }}
          dataSource={filteredCommentData}
          columns={commentColumns}
        />
      </Row>
    </>
  )
}

export default CommentManagePage
