import { useExtendOverlay } from '@overlastic/react'
import { Button, Form, FormProps, Input, InputNumber, Modal, Select } from 'antd'
import { noop } from '@/utils'
import { regions } from '@/config'

interface FieldType {
  members?: number
  score?: string
  countryCode?: string
}

export interface GroupAdvancedSearchDialogProps {
  initialValues?: FieldType
}

export function GroupAdvancedSearchDialog(props: GroupAdvancedSearchDialogProps) {
  const { resolve, reject, visible } = useExtendOverlay({
    duration: 300,
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const res = { ...values }
    if (!res.countryCode)
      delete res.countryCode
    if (!res.members)
      delete res.members
    if (!res.score)
      delete res.score
    resolve(res)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => resolve()
  return (
    <Modal
      title="Advanced Search"
      centered
      open={visible}
      onCancel={reject}
      footer={noop}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={props.initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType> className="mb-12px" label="Members" name="members">
          <InputNumber className="w-full" min={1} addonBefore="Min" />
        </Form.Item>

        <Form.Item<FieldType> className="mb-12px" label="MPower" name="score">
          <InputNumber className="w-full" min={1} addonBefore="Min" />
        </Form.Item>

        <Form.Item<FieldType> className="mb-12px" name="countryCode" label="Country">
          <Select
            allowClear
            options={regions.map(n => ({ label: n.name, value: n.countryCode }))}
            placeholder="The country where the group is located"
          />
        </Form.Item>

        <div className="mt-24px flex gap2 justify-end">
          <Button onClick={() => resolve()}>
            Clear
          </Button>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
