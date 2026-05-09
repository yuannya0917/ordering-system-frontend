import { Button, Card, List, Tag } from 'antd'

const commentData = [
  { title: '招牌黑椒牛柳饭', description: '味道很好，出餐也快。', extra: '5 星' },
  { title: '柠檬气泡茶', description: '希望下次可以少一点冰。', extra: '4 星' },
  { title: '番茄肥牛面', description: '汤底不错，分量合适。', extra: '5 星' },
]

function CommentManagePage() {
  return (
    <Card title="评论管理系统" bordered={false}>
      <List
        itemLayout="horizontal"
        dataSource={commentData}
        renderItem={(item) => (
          <List.Item actions={[<Button key="reply" size="small">回复</Button>]}>
            <List.Item.Meta title={item.title} description={item.description} />
            <Tag color="gold">{item.extra}</Tag>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default CommentManagePage
