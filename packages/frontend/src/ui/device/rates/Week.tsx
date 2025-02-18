import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'antd-mobile'
import { If, storeToState } from '@hairy/react-utils'
import { groupings, statistics } from '@doitring/analyzkit'
import dayjs from 'dayjs'
import ReactDOMServer from 'react-dom/server'
import { DetailProps } from './types'
import { ECOption, HealthConsult, ReactECharts } from '@/components'
import { store } from '@/store'

export function Week(props: DetailProps) {
  const { t } = useTranslation()
  const [rates] = storeToState(store.miner, 'rates')

  const detail = statistics.rates.week(props.date, rates)

  const daily = groupings.fills(props.date, detail.daily, 'w', { score: 0 })

  const heartOptions: ECOption = {
    xAxis: {
      type: 'category',
      axisTick: { show: false },
      axisLine: { show: false },
      data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: 'rgba(255, 255, 255, 0.2)' },
      },
      position: 'right',
      max: 150,
      min: 0,
    },
    grid: { top: 10, left: 12, right: 30, bottom: 30 },
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
                <span>{params.data?.min}</span>
                <span>-</span>
                <span>{params.data?.max}</span>
              </span>
              <span className="text-12px">bpm</span>
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
        name: 'Placeholder',
        type: 'bar',
        stack: 'Total',
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent',
        },
        emphasis: {
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent',
          },
        },
        data: daily.map(day => ({ value: day.min, ...day })),
      },
      {
        data: daily.map(day => ({ value: day.max - day.min, ...day })),
        name: 'Sleep',
        type: 'bar',
        stack: 'Total',
        barMinWidth: 10,
        barMaxWidth: 12,
        itemStyle: {
          borderRadius: 20,
          color: '#f87171',
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
              {detail.average}
            </span>
            <span>beats per minute</span>
          </div>
          <div className="text-white text-op-50">
            {dayjs.unix(props.date).startOf('w').format('MM/DD')}
            <span>-</span>
            {dayjs.unix(props.date).endOf('w').format('MM/DD')}
          </div>
        </If>
      </div>
      <div className="h-280px bg-black bg-opacity-30 rounded mt-12px mb24px">
        <ReactECharts autoresize className="h-full" option={heartOptions} />
      </div>
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
