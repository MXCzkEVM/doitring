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
          onClick={() => router.replace('/device/oxygens')}
        />
        <span className="text-18px font-bold">{t('Blood oxygen concentration')}</span>
        <div className="i-material-symbols-help text-black text-24px" />
      </div>

      <Typography.Text>
        {t('Blood oxygen concentration 1')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Blood oxygen concentration 2')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text className="text-[rgba(255,255,255,0.45)]">
        {t('Blood oxygen concentration 3')}
      </Typography.Text>
    </div>
  )
}

export default Page
