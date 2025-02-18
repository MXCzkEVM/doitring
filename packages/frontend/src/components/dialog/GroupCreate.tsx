import { useExtendOverlay } from '@overlastic/react'
import { Button, Form, FormProps, Input, Modal, Radio } from 'antd'
import { useAccount } from 'wagmi'
import { useAsyncCallback } from '@hairy/react-utils'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { contracts } from '@harsta/client'
import { toast } from 'react-toastify'
import { Location } from '../inputs/Location'
import Tags from '../inputs/Tags'
import { Avatar } from '../inputs/Avatar'
import { getSignGroupCreate, getUserAddress } from '@/api'
import { noop, waitForProxyTransaction } from '@/utils'
import { helperPostPinFileToIPFS, helperPostPinJsonToIPFS } from '@/service'
import { useProxyMiner } from '@/hooks'

interface FieldType {
  name?: string
  tags?: string[]
  description?: string
  avatar?: File
  type?: 'open' | 'invite'
  hexagon?: string
}

export function GroupCreateDialog() {
  const { resolve, visible } = useExtendOverlay({
    duration: 300,
  })
  const [form] = Form.useForm<any>()
  const { t } = useTranslation()
  const { address } = useAccount()
  const reloadMiner = useProxyMiner()[1]

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const [loading, onFinish] = useAsyncCallback(async (values: Required<FieldType>) => {
    const DoitRingFriend = contracts.DoitRingFriend.resolve()
    const image = await helperPostPinFileToIPFS({ file: values.avatar })
    const ipfs = await helperPostPinJsonToIPFS({
      pinataMetadata: { name: values.name },
      pinataContent: {
        description: values.description,
        attributes: values.tags || [],
        name: values.name,
        hexagon: values.hexagon,
        type: values.type,
        image,
      },
    })
    const { data: signature } = await getSignGroupCreate({ sender: address!, uri: ipfs })
    const transaction = DoitRingFriend.create.populateTransaction(
      address!,
      ipfs,
      signature,
    )
    await waitForProxyTransaction(transaction, 'create')
    await awaitGroupIndex()
    await reloadMiner()
    toast.success(`🎉 ${t('Created Group successfully')}`, { autoClose: 2000 })
    resolve()
  })

  async function awaitGroupIndex() {
    const { data: user } = await getUserAddress({ address: address! })
    if (user?.group)
      return true
    await new Promise(resolve => setInterval(resolve, 1000))
    return awaitGroupIndex()
  }

  return (
    <Modal
      title={(
        <div className="pr-4">
          Create your own Group lead your members to $Blueberry
        </div>
      )}
      wrapClassName="ant-content-with-full"
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
    >
      <Form
        name="basic"
        wrapperCol={{ xs: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true, type: 'open' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        layout="vertical"
        className="w-full ant-form-with-label-right"
        labelCol={{ xs: 8, sm: 6 }}
        labelAlign="right"
      >
        <Form.Item<FieldType>
          name="avatar"
          label={t('Image')}
          rules={[{ required: true, message: t('Please select an avatar') }]}
        >
          <Avatar />
        </Form.Item>
        <Form.Item<FieldType>
          label={t('Group Name')}
          name="name"
          className="w-full"
          rules={[{ required: true, message: t('Please input group name') }]}
        >
          <Input placeholder={t('Please input group name')} maxLength={30} />
        </Form.Item>
        <Form.Item<FieldType>
          label={t('Description')}
          name="description"
          rules={[{ required: true, message: t('Please input group description') }]}
        >
          <Input.TextArea placeholder={t('Please input group description')} maxLength={100} />
        </Form.Item>
        <Form.Item<FieldType>
          label={t('Badge')}
          name="tags"
          rules={[
            { type: 'array', max: 6, message: t('Exceeding tags length') },
          ]}
        >
          <Tags maxLength={5} />
        </Form.Item>
        <Form.Item<FieldType>
          label={t('Type')}
          name="type"
        >
          <Radio.Group size="small" optionType="button">
            <Radio className="text-12px" value="open">Open</Radio>
            <Radio className="text-12px" value="invite">Only invite</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<FieldType>
          label={t('Hexagon')}
          name="hexagon"
          rules={[{ required: true, message: t('Please input group description') }]}
        >
          <Location />
        </Form.Item>
        <div className="flex">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="flex-1 mx-24px"
          >
            {t('Create')}
          </Button>
        </div>

      </Form>
    </Modal>
  )
}
