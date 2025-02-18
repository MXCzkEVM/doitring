import { useTranslation } from 'react-i18next'
import { groupings, statistics } from '@doitring/analyzkit'
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

export function Week(props: DetailProps) {
  const { t } = useTranslation()
  const [data] = storeToState(store.miner, 'steps')

  const dayTotal = useProxyTotal()[0]
  const total = dayTotal * 7n

  const detail = statistics.steps.week(
    props.date,
    data,
  )

  const daily = groupings.fills(props.date, detail.daily, 'w', { score: 0 })

  const options: ECOption = {
    xAxis: {
      type: 'category',
      data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      splitLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: 'rgba(255, 255, 255, 0.2)' },
      },
      position: 'right',
      offset: 20,
      max: Number(dayTotal),
    },
    grid: { top: 10, left: 12, right: 70, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(34,34,34)',
      borderColor: 'transparent',
      textStyle: { color: 'rgba(255, 255, 255, 0.5)' },
      formatter: ([params]: any) => {
        if (!params.data.value)
          return null as any
        return ReactDOMServer.renderToString(
          <div className="flex-col gap-4px">
            <div className="flex items-end gap-4px line-height-none">
              <span className="text-24px">
                {params.data.value}
              </span>
              <span className="text-12px">step</span>
            </div>
            <div className="text-12px line-height-none">
              <span>{params.data?.ytd}</span>
            </div>
          </div>,
        )
      },
    },
    series: [
      {
        data: daily.map(day => ({ value: day.total, ...day })),
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
            {dayjs.unix(props.date).startOf('w').format('MM/DD')}
            <span>-</span>
            {dayjs.unix(props.date).endOf('w').format('MM/DD')}
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
          <div className="flex-center gap-6px">
            <span className="text-[rgba(255,255,255,0.45)]">
              {t('Goal_steps', { step: total })}
            </span>
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
