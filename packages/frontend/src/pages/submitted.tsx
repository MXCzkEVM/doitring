import { Button, Result, Spin } from 'antd'
import { useRouter } from 'next/router'
import { useAsync } from 'react-use'
import { If } from '@hairy/react-utils'
import { useTranslation } from 'react-i18next'
import { postOrderConfirm } from '@/api'
import { Trans } from '@/components'

function Page() {
  const router = useRouter()
  const { t } = useTranslation()
  async function request(): Promise<any> {
    if (!router.query.payment_intent_client_secret)
      return
    return postOrderConfirm({
      secret: router.query.payment_intent_client_secret as string,
      paymentIntent: router.query.payment_intent as string,
    })
  }

  const { value: order, loading } = useAsync(request, [router.query])

  return (
    <div>
      <section className="relative h-320px flex-col items-center mb-24px">
        <img
          className="absolute object-cover inset-0 w-full h-full object-cover lg:object-center"
          src="https://www.blueberryring.com/assets/pages/product/ring.png"
        />
      </section>
      <Spin spinning={loading}>
        <If cond={!loading} else={<div className="h-360px" />}>
          <Result
            status="success"
            title="Blueberry Ring Order Successfully Placed!"
            subTitle={(
              <div className="flex-col-center">
                <span>
                  <Trans i18nKey="Order number Text" number={order?.id || '--'} />
                </span>
                <span>

                  <span className="mr-12px">{t('Having problems')}</span>
                  <a href="https://t.co/il2zPd25cj">https://t.co/il2zPd25cj</a>
                </span>
              </div>
            )}
            icon={(
              <div className="flex-center">
                <div className="i-line-md-confirm-circle-twotone text-light-5 text-84px" />
              </div>
            )}
            extra={[
              <Button type="primary" key="home" onClick={() => router.replace('/')}>
                {t('Go Home')}
              </Button>,
              <Button key="buy" onClick={() => router.replace('/order')}>
                {t('Buy Again')}
              </Button>,
            ]}
          />
        </If>
      </Spin>
    </div>
  )
}

export default Page
