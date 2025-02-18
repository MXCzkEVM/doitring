import { Button, Form, FormProps, Input, Radio, Switch } from 'antd'
import { ReactNode, useState } from 'react'
import { If, useAsyncCallback } from '@hairy/react-utils'
import { useTranslation } from 'react-i18next'
import { showOpenImagePicker } from '@hairy/browser-utils'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { contracts } from '@harsta/client'
import { useMount } from 'react-use'
import Layout from '@/layout'
import Tags from '@/components/inputs/Tags'
import { helperPostPinFileToIPFS, helperPostPinJsonToIPFS } from '@/service'
import { getCurrentHexagon, waitForProxyTransaction } from '@/utils'
import { useProxyMiner } from '@/hooks'
import { getSignGroupCreate, getUserAddress } from '@/api'

interface FieldType {
  name?: string
  tags?: string[]
  description?: string
  avatar?: File
  type?: 'open' | 'invite'
  hexagon?: string
}

function Page() {
  const [form] = Form.useForm<any>()
  const { t } = useTranslation()
  const { address } = useAccount()
  const router = useRouter()
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
        attributes: values.tags,
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
    await reloadMiner()
    await awaitGroupIndex()
    toast.success(`🎉 ${t('Created Group successfully')}`, {
      onClose: () => router.replace('/friends'),
      pauseOnFocusLoss: false,
      autoClose: 2000,
    })
  })

  async function awaitGroupIndex() {
    const { data: user } = await getUserAddress({ address: address! })
    if (user?.group)
      return true
    await new Promise(resolve => setInterval(resolve, 1000))
    return awaitGroupIndex()
  }

  return (
    <div className="flex-col m-24px gap-24px items-center mt-68px">
      <Form
        name="basic"
        wrapperCol={{ xs: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true, type: 'open' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
        layout="horizontal"
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
            { type: 'array', required: true, message: t('Please enter the associated tags') },
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
        <Form.Item className="flex-center">
          <Button
            className="w-200px"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {t('Submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

interface AvatarProps {
  defaultValue?: string
  value?: File
  onChange?: (value: File) => void
}

function Avatar(props: AvatarProps) {
  const [avatar, setAvatar] = useState(props.defaultValue)
  const [_, setAvatarFile] = useState<File>()

  async function onChangeAvatarByLocal() {
    const [file] = await showOpenImagePicker({ multiple: false })
    setAvatar(URL.createObjectURL(file))
    setAvatarFile(file)
    props.onChange?.(file)
  }

  return (
    <div className="relative">
      <div className="w-48px h-48px rounded-full overflow-hidden" onClick={onChangeAvatarByLocal}>
        <If
          cond={avatar}
          then={(
            <div className="w-full h-full relative">
              <img className="w-full h-full object-cover" src={avatar} />
              <div className="inset-0 absolute opacity-0 hover:opacity-50 transition-opacity bg-dark flex-center">
                <div className="text-24px i-material-symbols-add-photo-alternate-rounded" />
              </div>
            </div>
          )}
          else={(
            <div className="w-full h-full bg-dark flex-center">
              <div className="text-24px i-material-symbols-add-photo-alternate-rounded" />
            </div>
          )}
        />
      </div>
    </div>

  )
}

interface LocationProps {
  value?: string
  onChange?: (value: string) => void
}
function Location(props: LocationProps) {
  const [loading, callback] = useAsyncCallback(async () => {
    const hexagon = await getCurrentHexagon()
    if (hexagon)
      props.onChange?.(hexagon)
  })

  useMount(callback)
  return (
    <If
      cond={props.value}
      then={(
        <div className="flex items-center gap-1">
          <Input value={props.value} disabled />
        </div>
      )}
      else={(
        <Button loading={loading}>
          Authorize
        </Button>
      )}
    />
  )
}

Page.layout = function layout(page: ReactNode) {
  return (
    <Layout
      navbarProps={{ register: false, back: true }}
      showTabbar
      showNavbar
    >
      {page}
    </Layout>
  )
}

export default Page
