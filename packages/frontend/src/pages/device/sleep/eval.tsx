import { Card, Divider, List, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

function Page() {
  const { t } = useTranslation()
  const router = useRouter()

  const data = [
    t('sleep-eval-row-1'),
    t('sleep-eval-row-2'),
    t('sleep-eval-row-3'),
    t('sleep-eval-row-4'),
    t('sleep-eval-row-4_5'),
    t('sleep-eval-row-5'),
    t('sleep-eval-row-6'),
    t('sleep-eval-row-7'),
  ]
  return (
    <div className="mx-24px">
      <div className="py-12px flex items-center justify-between mb-12px">
        <div
          className="i-material-symbols-arrow-back-rounded text-24px"
          onClick={() => router.replace('/device/sleep')}
        />
        <span className="text-18px font-bold">{t('Sleep evaluation')}</span>
        <div className="i-material-symbols-help text-black text-24px" />
      </div>
      <div className="flex items-center gap-8px">
        <div
          className="rounded-full flex-center"
          style={{ width: '24px', height: '24px', background: '#AF89FF' }}
        >
          <div className="i-iconamoon-lightning-1 text-16px" />
        </div>
        <span className="font-bold text-16px">{t('How to improve sleep quality')}</span>
      </div>

      <Divider className="mb-8px" />

      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            {item}
          </List.Item>
        )}
      />
    </div>
  )
}

export default Page
