import { Form, Input, InputNumber, Modal } from 'antd'
import { useEffect } from 'react'

export type CuisineFormValues = {
  cover: string
  name: string
  category: string
  price: number
  stock: number
}

type CuisineFormModalProps = {
  open: boolean
  title: string
  initialValues?: Partial<CuisineFormValues>
  onCancel: () => void
  onSubmit: (values: CuisineFormValues) => void
}

function CuisineFormModal({
  open,
  title,
  initialValues,
  onCancel,
  onSubmit,
}: CuisineFormModalProps) {
  const [form] = Form.useForm<CuisineFormValues>()

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues ?? {})
      return
    }

    form.resetFields()
  }, [form, initialValues, open])

  const handleOk = async () => {
    const values = await form.validateFields()
    onSubmit(values)
  }

  return (
    <Modal
      title={title}
      open={open}
      okText="保存"
      cancelText="取消"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="菜品封面"
          name="cover"
          rules={[{ required: true, message: '请输入菜品封面图片地址' }]}
        >
          <Input placeholder="请输入封面图片地址" />
        </Form.Item>
        <Form.Item
          label="菜品名称"
          name="name"
          rules={[{ required: true, message: '请输入菜品名称' }]}
        >
          <Input placeholder="请输入菜品名称" />
        </Form.Item>
        <Form.Item
          label="类别"
          name="category"
          rules={[{ required: true, message: '请输入类别' }]}
        >
          <Input placeholder="请输入类别" />
        </Form.Item>
        <Form.Item
          label="价格"
          name="price"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="库存"
          name="stock"
          rules={[{ required: true, message: '请输入库存' }]}
        >
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CuisineFormModal
