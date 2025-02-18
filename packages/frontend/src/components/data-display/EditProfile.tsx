import { showOpenImagePicker } from '@hairy/browser-utils'
import { If, useAsyncCallback } from '@hairy/react-utils'
import { Button, Form, FormProps, Input, Modal } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { contracts } from '@harsta/client'
import { toast } from 'react-toastify'
import { waitForProxyTransaction } from '@/utils'
import { helperPostPinFileToIPFS } from '@/service'
import { useProxyMiner } from '@/hooks'

interface FieldType {
  nickname?: string
  avatar?: File
}
export interface EditProfileProps {
  onChanged?: () => void
  onCancel?: () => void
}
export function EditProfile(props: EditProfileProps) {
  const { t } = useTranslation()
  const [form] = Form.useForm<any>()
  const [{ value: miner }, reloadMiner] = useProxyMiner()

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const [loading, onFinish] = useAsyncCallback(
    async (values: Required<FieldType>) => {
      if (!miner)
        return
      if (!values.avatar) {
        toast.error(t('Please select an avatar'))
        return
      }
      const avatar = await helperPostPinFileToIPFS({ file: values.avatar })
      const Storage = contracts.Storage.resolve()
      const key = `ring_${miner.sncode}`
      const transaction = Storage.setStorage.populateTransaction(key, [
        ['nickname', values.nickname],
        ['avatar', avatar],
      ])
      await waitForProxyTransaction(transaction, 'setStorage')
      await reloadMiner('personal')
      props.onChanged?.()
    },
  )

  return (
    <Form
      name="basic"
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
      layout="vertical"
      className="w-full mt-4"
    >
      <Form.Item<FieldType>
        name="avatar"
        className="flex-center text-center"
      >
        <Avatar />
      </Form.Item>
      <Form.Item<FieldType>
        label={t('Nick Name')}
        name="nickname"
        className="w-full"
        rules={[{ required: true, message: t('Please input nick name') }]}
      >
        <Input placeholder={t('Please input nick name')} />
      </Form.Item>
      <div className="mb-4">
        {t('User Supplementary Text 1')}
      </div>
      <Form.Item className="flex justify-end">
        <Button className="mr-2" onClick={() => props.onCancel?.()}>
          {t('Cancel')}
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {t('Next')}
        </Button>
      </Form.Item>
    </Form>
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
    console.log(file)
  }

  return (
    <div className="relative">
      <div className="w-120px h-120px rounded-full overflow-hidden" onClick={onChangeAvatarByLocal}>
        <If
          cond={avatar}
          then={(
            <div className="w-full h-full relative">
              <img className="w-full h-full object-cover" src={avatar} />
              <div className="inset-0 absolute opacity-0 hover:opacity-50 transition-opacity bg-dark flex-center">
                <div className="text-48px i-material-symbols-add-photo-alternate-rounded" />
              </div>
            </div>
          )}
          else={(
            <div className="w-full h-full bg-dark flex-center">
              <div className="text-48px i-material-symbols-add-photo-alternate-rounded" />
            </div>
          )}
        />
      </div>
      <div className="text-red-5 font-bold absolute left-0px top-0px">*</div>
    </div>

  )
}
