import { Form, Input, InputNumber, Modal } from 'antd'
import { useEffect } from 'react'

export type CuisineFormValues = {
  dishId: string
  dishName: string
  dishPrice: number
  dishIntroduction?: string
  menuId: string
}

type CuisineFormModalProps = {
  open: boolean
  title: string
  initialValues?: Partial<CuisineFormValues>
  onCancel: () => void
  onSubmit: (values: CuisineFormValues) => void | Promise<void>
  confirmLoading?: boolean
  dishIdDisabled?: boolean
}

function CuisineFormModal({
  open,
  title,
  initialValues,
  onCancel,
  onSubmit,
  confirmLoading,
  dishIdDisabled,
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
    await onSubmit(values)
  }

  return (
    <Modal
      title={title}
      open={open}
      okText="保存"
      cancelText="取消"
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="菜品ID"
          name="dishId"
          rules={[{ required: true, message: '请输入菜品ID' }]}
        >
          <Input disabled={dishIdDisabled} placeholder="请输入菜品ID" />
        </Form.Item>
        <Form.Item
          label="菜品名称"
          name="dishName"
          rules={[{ required: true, message: '请输入菜品名称' }]}
        >
          <Input placeholder="请输入菜品名称" />
        </Form.Item>
        <Form.Item
          label="菜品价格"
          name="dishPrice"
          rules={[{ required: true, message: '请输入菜品价格' }]}
        >
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="菜品介绍"
          name="dishIntroduction"
        >
          <Input.TextArea rows={3} placeholder="请输入菜品介绍" />
        </Form.Item>
        <Form.Item
          label="所属菜单ID"
          name="menuId"
          rules={[{ required: true, message: '请输入所属菜单ID' }]}
        >
          <Input placeholder="请输入所属菜单ID" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CuisineFormModal
