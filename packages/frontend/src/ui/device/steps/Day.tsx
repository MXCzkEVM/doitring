import { useTranslation } from 'react-i18next'
import { statistics } from '@doitring/analyzkit'
import { Card, Progress } from 'antd'
import { If, storeToState } from '@hairy/react-utils'
import ReactDOMServer from 'react-dom/server'
import dayjs from 'dayjs'
import { useOverlayInject } from '@overlastic/react'
import { DetailProps } from './types'
import { filterEChartsData } from './utils'
import { useProxyTotal } from './hooks'
import { store } from '@/store'
import { ECOption, HealthConsult, ReactECharts, StepsChangeDialog } from '@/components'
import { percentage } from '@/utils'

const labels = [
  '00:00',
  '06:00',
  '12:00',
  '18:00',
  '23:00',
]

export function Day(props: DetailProps) {
  const { t } = useTranslation()
  const [data] = storeToState(store.miner, 'steps')

  const [total, reloadTotal] = useProxyTotal()
  const openStepsChangeDialog = useOverlayInject(StepsChangeDialog)

  const detail = statistics.steps.day(
    props.date,
    data,
  )

  async function onChangeTotal() {
    await openStepsChangeDialog({ default: total })
    await reloadTotal()
  }

  const values = detail?.hours.flatMap(h => h.data.map(d => d.value)) || [0]
  const max = Math.max(...values, 800)

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
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(255, 255, 255, 0.2)' } },
      position: 'right',
      offset: 20,
      max,
    },
    grid: { top: 10, left: 12, right: 60, bottom: 30 },
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
                {target?.total}
              </span>
              <span className="text-12px">step</span>
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
        data: filterEChartsData(detail?.hours, 'total'),
        type: 'bar',
        barWidth: 5,
        itemStyle: {
          borderRadius: [20, 20, 0, 0],
          color: 'rgb(251, 191, 36, 0.8)',
        },
        showBackground: false,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
          borderRadius: [20, 20, 0, 0],
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
              {detail.total}
            </span>
            <span>steps</span>
          </div>
          <div className="text-white text-op-50">
            {detail.ytd}
          </div>
        </If>
      </div>
      <div className="h-280px bg-black bg-opacity-30 rounded mt-12px mb-24px">
        <ReactECharts autoresize className="h-full" option={options} />
      </div>
      <Card>
        <div className="flex items-center justify-between mb-18px">
          <div className="flex-center">
            <span className="text-24px mr-6px">{detail?.total || '-'}</span>
            <span className="text-[rgba(255,255,255,0.45)]">{t('Daily total steps')}</span>
          </div>
          <div className="flex-center gap-6px" onClick={onChangeTotal}>
            <span className="text-[rgba(255,255,255,0.45)]">
              {t('Goal_steps', { step: total })}
            </span>
            <div className="i-material-symbols-edit text-16px" />
          </div>
        </div>
        <Progress
          className="ml-4px"
          percent={percentage(Number(total), detail?.total || 0, 0)}
          strokeColor="rgb(251, 191, 36, 0.8)"
          format={() => null}
          size={{ height: 18 }}
        />
      </Card>
    </>
  )
}
