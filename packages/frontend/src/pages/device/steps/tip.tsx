import { Divider, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

function Page() {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className="mx-24px">
      <div className="py-12px flex items-center justify-between mb-12px">
        <div
          className="i-material-symbols-arrow-back-rounded text-24px"
          onClick={() => router.replace('/device/steps')}
        />
        <span className="text-18px font-bold">{t('Steps evaluatiuon')}</span>
        <div className="i-material-symbols-help text-black text-24px" />
      </div>
      <div className="flex items-center gap-8px">
        <div
          className="rounded-full flex-center bg-amber flex-shrink-0"
          style={{ width: '24px', height: '24px' }}
        >
          <div className="i-ri-footprint-fill text-16px" />
        </div>
        <span className="font-bold text-16px">{t('How did Blueberryring evaluate your step number')}</span>
      </div>

      <Divider className="mb-8px" />
      <Typography.Text>
        {t('Steps evaluatiuon Text 1')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Steps evaluatiuon Text 2')}
      </Typography.Text>
    </div>
  )
}

export default Page
