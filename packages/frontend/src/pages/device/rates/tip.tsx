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
          onClick={() => router.replace('/device/rates')}
        />
        <span className="text-18px font-bold">{t('Heart Rate')}</span>
        <div className="i-material-symbols-help text-black text-24px" />
      </div>

      <Typography.Text>
        {t('Heart Rate Text 1')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Heart Rate Text 2')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Heart Rate Text 3')}
      </Typography.Text>
      <Typography.Title level={3}>
        {t('Exercise heart rate interval')}
      </Typography.Title>
      <Typography.Text>
        {t('Exercise heart rate interval Text 1')}
      </Typography.Text>
    </div>
  )
}

export default Page
