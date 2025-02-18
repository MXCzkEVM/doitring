import { Button, Card, Form, FormProps, Input, Modal, QRCode, Select, Slider } from 'antd'
import { ReactNode, useMemo, useState } from 'react'
import { If, storeToState, useAsyncCallback } from '@hairy/react-utils'
import { isAddress } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { contracts, defaultAddresses } from '@harsta/client'
import { useOverlayInject } from '@overlastic/react'
import { useMount } from 'react-use'
import { regions } from '@/config'
import { parsePhone } from '@/utils'
import { CheckoutDialog, InputPhoneNumber } from '@/components'
import Layout from '@/layout'
import { postOrder } from '@/api'
import { OrderCreateBody } from '@/api/index.type'
import { FingerMeasurementDialog } from '@/components/dialog/FingerMeasurement'
import { AddressScannerDialog } from '@/components/dialog/AddressScanner'
import { store } from '@/store'
import ImageSizes from '@/assets/images/sizes.png'

interface FieldType {
  name?: string
  email?: string
  region?: string
  phone?: string
  address?: string
  hash?: string
  size?: string
  invitation?: string
}

function isMobile() {
  return typeof window !== 'undefined'
    && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || window.axs !== undefined
}

function Page() {
  const { t } = useTranslation()
  const { address } = useAccount()
  const DoitRingDevice = contracts.DoitRingDevice.resolve()
  const openFingerMeasurementDialog = useOverlayInject<any, string>(FingerMeasurementDialog)
  const openAddressScannerDialog = useOverlayInject(AddressScannerDialog)
  const [inviter] = storeToState(store.config, 'inviter')
  const [form] = Form.useForm<FieldType>()
  const phone = Form.useWatch('phone', form)
  const region = Form.useWatch('region', form)
  const prefix = useMemo(() => findMobilePrefix(region), [region])
  const parsed = useMemo(() => parsePhone(phone, region, prefix), [phone, region])
  const invitation = Form.useWatch('invitation', form)
  const openCheckoutDialog = useOverlayInject(CheckoutDialog)
  const [modal, holder] = Modal.useModal()

  const [loadFinish, onFinish] = useAsyncCallback(async (_values: Required<FieldType>) => {
    const values = { ..._values }

    values.size = isMobile() ? await openFingerMeasurementDialog() : values.size || '10'

    if (values.invitation) {
      const { token } = await DoitRingDevice.getTokenInAddress(values.invitation)
      if (token === defaultAddresses.ZERO) {
        toast.error(t('Invitation address not bound to ring'))
        return
      }
    }

    const data: OrderCreateBody = {
      address: values.address,
      email: values.email,
      invitation: values.invitation,
      name: values.name,
      phone: values.phone,
      region: values.region,
      size: +values.size,
    }

    const order = await postOrder(data)

    if (!order.secret)
      return
    openCheckoutDialog({ order })
  })

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  function findMobilePrefix(code?: string) {
    const find = regions?.find(v => v.countryCode === code)
    return find?.mobilePrefix
  }

  useMount(() => {
    if (isMobile())
      return

    modal.warning({
      title: t('Warning'),
      content: (
        <div className="flex gap-2 mb-12px">
          <span className="text-14px">{t('Desktop Warning Ring Sizing Content')}</span>
          <QRCode size={100} border={false} className="flex-shrink-0" value={`${location.origin}?measure=true`} />
        </div>
      ),
      okText: t('I measured from mobile view'),
    })
  })

  return (
    <>
      {holder}
      <section className="relative h-320px flex-col items-center mb-24px">
        <div className="relative z-1 flex-col-center mt-32px ">
          <h5 className="font-bold leading-tight mx-24px text-center text-slate-200 text-24px max-w-360px mb-12px">
            {t('Transform Your Health with a Single Touch')}
          </h5>
          <p className="mx-12px max-w-400px text-center text-[#93a2b8] mb-36px">
            {t('Discover the Blueberry Ring Text')}
          </p>
        </div>
        <img
          className="absolute object-cover inset-0 w-full h-full object-cover lg:object-center"
          src="/ring-background.png"
        />
      </section>
      <div className="mx-24px">
        <Form
          name="basic"
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ invitation: inviter }}
          onFinish={onFinish as any}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
          layout="vertical"
        >
          <Form.Item<FieldType>
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: t('Please input your name') }]}
          >
            <Input placeholder={t('Please input your name')} />
          </Form.Item>
          <Form.Item<FieldType>
            label={t('Email')}
            name="email"
            rules={[
              { required: true, message: t('Please input your email') },
              { type: 'email', message: t('Please input the correct Email format') },
            ]}
          >
            <Input placeholder={t('Please input your email')} />
          </Form.Item>
          <div className="flex gap-8px">
            <Form.Item<FieldType>
              className="w-150px"
              label="Country/Region"
              name="region"
              rules={[{ required: true, message: t('Please select your country') }]}
            >
              <Select
                placeholder={t('Country-Region')}
                onChange={() => form.validateFields(['phone'])}
                showSearch
                options={regions.map(n => ({ label: n.name, value: n.countryCode }))}
              />
            </Form.Item>
            <Form.Item<FieldType>
              label={t('Phone No')}
              name="phone"
              className="flex-1"
              rules={[
                { required: true, message: t('Please input your phone number') },
                {
                  validator: (_, value) => {
                    if (!value || parsed.verify)
                      return Promise.resolve()
                    const error = new Error(t('Please input the correct format for the phone number'))
                    return Promise.reject(error)
                  },
                },
              ]}
            >
              <InputPhoneNumber prefix={prefix} parsed={parsed} placeholder={t('Phone No')} />
            </Form.Item>
          </div>
          <Form.Item<FieldType>
            label={t('Receiving address')}
            name="address"
            className="flex-1"
            rules={[{ required: true, message: t('Please enter your shipping address') }]}
          >
            <Input.TextArea placeholder={t('Please enter your shipping address')} count={{ max: 200 }} />
          </Form.Item>
          <If cond={!isMobile}>
            <Form.Item<FieldType>
              label={t('Ring size')}
              name="size"
              required
              tooltip={{
                rootClassName: 'max-w-[95vw]',
                title: (
                  <div>
                    <div className="mb-12px">{t('Ring Size Text')}</div>
                    <img className="w-full" src={ImageSizes.src} />
                  </div>
                ),
                trigger: 'click',
              }}
            >
              <Slider
                tooltip={{ formatter: v => `#${v}` }}
                marks={{ 8: '#8', 10: '#10', 13: '#13' }}
                defaultValue={10}
                min={8}
                max={13}
              />
            </Form.Item>
          </If>

          <Form.Item>
            <div className="flex-col-center">
              <Card className="bg-transparent">
                <img className="w-72px h-72px" src="/ring-icon.png" />
              </Card>
              <h4 className="mt-8px mb-0">
                {' '}
                {isAddress(invitation)
                  ? (
                      <span>
                        <s>349</s>
                        (314)
                      </span>
                    )
                  : 349}
                {' '}
                USD
              </h4>
            </div>
          </Form.Item>

          <Form.Item<FieldType>
            label={t('Invitation Moonchain address')}
            name="invitation"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || isAddress(value))
                    return Promise.resolve()
                  const error = new Error(t('Please enter correct address format'))
                  return Promise.reject(error)
                },
              },
              {
                validator: (_, value) => {
                  if (!value || value !== address)
                    return Promise.resolve()
                  const error = new Error(t('Cannot enter one_s own address'))
                  return Promise.reject(error)
                },
              },
            ]}
          >
            <Input
              disabled={!!inviter}
              suffix={(
                <div
                  className="i-mdi-line-scan text-18px cursor-pointer"
                  onClick={inviter
                    ? undefined
                    : (event) => {
                        event.stopPropagation()
                        event.preventDefault()
                        openAddressScannerDialog()
                          .then(value => form.setFieldValue('invitation', value))
                      }}
                />
              )}
              placeholder={t('Enter the inviter_s address to get more discounts')}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button className="w-full" type="primary" htmlType="submit" loading={loadFinish}>
              {t('Confirm')}
            </Button>
          </Form.Item>

        </Form>
        <div className="flex-center">
          <span className="mr-12px">Having problems? Check our Discord</span>
          <a href="https://t.co/il2zPd25cj">https://t.co/il2zPd25cj</a>
        </div>
      </div>
    </>
  )
}

Page.layout = function layout(page: ReactNode) {
  return <Layout showNavbar navbarProps={{ back: true }}>{page}</Layout>
}
export default Page
