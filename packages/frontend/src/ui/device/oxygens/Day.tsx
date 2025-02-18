import { useTranslation } from 'react-i18next'
import { Card } from 'antd-mobile'
import { Card as ACard } from 'antd'
import { If, storeToState } from '@hairy/react-utils'
import { statistics } from '@doitring/analyzkit'
import ReactDOMServer from 'react-dom/server'
import dayjs from 'dayjs'
import { DetailProps } from './types'
import { filterEChartsData } from './utils'
import { ECOption, ReactECharts } from '@/components'
import { store } from '@/store'

const labels = [
  '00:00',
  '06:00',
  '12:00',
  '18:00',
  '23:00',
]

export function Day(props: DetailProps) {
  const { t } = useTranslation()
  const [data] = storeToState(store.miner, 'oxygens')

  const detail = statistics.oxygens.day(props.date, data)
  const at = detail.hours.filter(v => v.average).at(-1)
  const options: ECOption = {
    xAxis: {
      type: 'category',
      data: detail.hours.map(v => v.hour),
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        interval: (_, value) =>
          labels.includes(value),
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
          type: 'dashed',
        },
      },
      position: 'right',
      max: 100,
      min: 80,
    },
    grid: { top: 10, left: 12, right: 30, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(34,34,34)',
      borderColor: 'transparent',
      textStyle: { color: 'rgba(255, 255, 255, 0.5)' },
      formatter: ([params]: any) => {
        if (!params.data)
          return null as any
        const target = detail.hours.find(item => item.hour === params.axisValue)
        const [hr, min] = params.axisValueLabel.split(':')
        const duration = dayjs.duration({ hours: hr, minutes: min })
        return ReactDOMServer.renderToString(
          <div className="flex-col gap-4px">
            <div className="flex items-end gap-4px line-height-none">
              <span className="text-24px">
                {target?.average}
              </span>
              <span className="text-12px">%</span>
            </div>
            <div className="text-12px line-height-none">
              <span>{params.axisValueLabel}</span>
              <span>-</span>
              <span>{duration.add(1800, 's').format('HH:mm')}</span>
            </div>
          </div>,
        )
      },
    },
    series: [
      {
        lineStyle: { width: 1 },
        showSymbol: false,
        color: '#1a72c2',
        data: filterEChartsData(detail.hours, 'average'),
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(26,114,194,5)' },
              { offset: 1, color: 'rgba(0,0,0,0)' },
            ],
          },
        },
      },
    ],
  }

  return (
    <>
      <div className="mt24px mb12px ml12px h-50px flex-col justify-center">
        <If
          cond={detail.data.length}
          else={<div className="text-28px">{t('No Data')}</div>}
        >
          <div className="flex items-end gap-4px mb-8px ">
            <span className="text-28px line-height-none font-bold">
              <span>{detail.min}</span>
              <span>-</span>
              <span>{detail.max}</span>
              <span>%</span>
            </span>
          </div>
          <div className="text-white text-op-50">{detail.ytd}</div>
        </If>
      </div>
      <div className="h-280px bg-black bg-opacity-30 rounded mt-12px mb-24px">
        <ReactECharts autoresize className="h-full" option={options} />
      </div>
      <ACard size="small" className="mb-24px">
        <div className="flex justify-between">
          <span>
            <span className="font-bold text-base">
              {t('Latest')}
              :
              {' '}
            </span>
            <span>{at?.hour || '--'}</span>
          </span>
          <span>
            <span>{at?.average || '--'}</span>
            <span> %</span>
          </span>
        </div>
      </ACard>
      <Card className="px-64px py-12px">
        <div className="flex justify-between">
          <div className="flex-col-center gap-4px">
            <span className="text-24px">{detail?.average || '--'}</span>
            <span className="text-[rgba(255,255,255,0.45)]">{t('Average - jun')}</span>
          </div>
          <div className="flex-col-center gap-4px">
            <span className="text-24px">{detail?.min || '--'}</span>
            <span className="text-[rgba(255,255,255,0.45)]">{t('Minimum')}</span>
          </div>
          <div className="flex-col-center gap-4px">
            <span className="text-24px">{detail?.max || '--'}</span>
            <span className="text-[rgba(255,255,255,0.45)]">{t('Maximum')}</span>
          </div>
        </div>
      </Card>
    </>
  )
}
