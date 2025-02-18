import { useTranslation } from 'react-i18next'
import { Tabs, TabsProps } from 'antd'
import { useState } from 'react'
import { HealthConsult, HealthConsultContent } from './HealthConsult'

export function HealthFortuneTeller() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('options')
  const data = [
    { label: t('Fortune Teller Options - 0'), value: 0 },
    { label: t('Fortune Teller Options - 1'), value: 1 },
    { label: t('Fortune Teller Options - 2'), value: 2 },
    { label: t('Fortune Teller Options - 3'), value: 3 },
    { label: t('Fortune Teller Options - 4'), value: 4 },
  ]

  const items: TabsProps['items'] = [
    {
      key: 'options',
      label: 'Tab 1',
      children: (
        <div>
          <div className="text-14px flex-col gap-2">
            {data.map(item => (
              <div key={item.value} onClick={() => setTab(`${item.value}`)}>
                <span className="mr-2">
                  <span>{t('The Hobbits')}</span>
                  <span>:</span>
                </span>
                <span className="border-b border-b-solid">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: '0',
      label: 'none',
      children: <HealthConsultContentWithBack onBack={() => setTab('options')} prompt={0} />,
    },
    {
      key: '1',
      label: 'none',
      children: <HealthConsultContentWithBack onBack={() => setTab('options')} prompt={1} />,
    },
    {
      key: '2',
      label: 'none',
      children: <HealthConsultContentWithBack onBack={() => setTab('options')} prompt={2} />,
    },
    {
      key: '3',
      label: 'none',
      children: <HealthConsultContentWithBack onBack={() => setTab('options')} prompt={3} />,
    },
    {
      key: '4',
      label: 'none',
      children: <HealthConsultContentWithBack onBack={() => setTab('options')} prompt={4} />,
    },
  ]

  return (
    <HealthConsult
      type="fortuneTeller"
      date="d"
      title={t('The Prophet')}
      subtitle={t('It knows all')}
      icon={<div className="i-material-symbols-ev-shadow-outline text-16px translate-y-1px" />}
      content={(
        <Tabs
          className="text-[lime] tabs-not-headers"
          activeKey={tab}
          defaultActiveKey="1"
          items={items}
          onChange={setTab}
        />
      )}
    />
  )
}

function HealthConsultContentWithBack(props: { prompt: number, onBack?: () => void }) {
  const { t } = useTranslation()

  const data = [
    { label: t('Fortune Teller Options - 0'), value: 0 },
    { label: t('Fortune Teller Options - 1'), value: 1 },
    { label: t('Fortune Teller Options - 2'), value: 2 },
    { label: t('Fortune Teller Options - 3'), value: 3 },
    { label: t('Fortune Teller Options - 4'), value: 4 },
  ]
  return (
    <div className="flex-col">
      <div
        className="flex cursor-pointer mb-4"
        onClick={() => props.onBack?.()}
      >
        <div className="i-line-md-chevron-left text-20px pt-1" />
        <div className="text-14px">
          {data.find(d => d.value === props.prompt)?.label}
        </div>
      </div>
      <HealthConsultContent
        type="fortuneTeller"
        prompt={props.prompt}
        date="d"
      />
    </div>
  )
}
