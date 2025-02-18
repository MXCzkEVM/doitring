import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { groupings, statistics } from '@doitring/analyzkit'
import { Alert as AAlert, Card, List } from 'antd'
import dayjs from 'dayjs'
import { If } from '@hairy/react-utils'
import { ReactNode } from 'react'
import ReactDOMServer from 'react-dom/server'
import { DetailProps } from './types'
import { seriesWithBorder, whenever } from '@/utils'
import { ECOption, HealthConsult, ReactECharts } from '@/components'

export function Month(props: DetailProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const detail = statistics.sleeps.month(
    props.date,
    props.data,
  )

  const last = statistics.sleeps.month(
    dayjs.unix(props.date).subtract(1, 'M').unix(),
    props.data,
  )

  const daily = groupings.fills(props.date, detail.daily, 'M', { score: 0 })

  const evaluates = {
    high: t('Good sleep quality'),
    normal: t('Sleep quality needs to be improved'),
    low: t('Poor sleep quality'),
  }

  const [hr, min] = dayjs.duration(detail.duration, 's').format('HH:mm').split(':')
  const durations = diffDurations(detail.duration, last.duration)

  const diffTimes = [
    durations[0] && `${durations[0]} Hr `,
    durations[1] && `${durations[1]}  
     Min`,
  ]
  const difference = diffTimes.filter(Boolean).join('')

  const optionsByScores: ECOption = {
    xAxis: {
      type: 'category',
      axisTick: { show: false },
      axisLine: { show: false },
      data: daily.map(d => `${dayjs.unix(d.date).date()}d`),
      axisLabel: { fontSize: '10px' },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: [
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.2)',

          ],
        },
      },
      axisLine: { show: false },
      axisLabel: { fontSize: '10px' },
      position: 'right',
      max: 100,
    },
    grid: { top: 20, left: 12, right: 26, bottom: 25 },
    tooltip: {
      trigger: 'axis',
      formatter: ([params]: any) => {
        if (!params.data)
          return null as any
        return ReactDOMServer.renderToString(
          <div className="flex-col gap-4px">
            <div className="flex items-end gap-4px">
              <span className="text-24px line-height-none">
                {params.data}
              </span>
              <span className="text-12px">pts</span>
            </div>
            <div className="text-12px">
              {params.axisValueLabel}
            </div>
          </div>,
        )
      },
      backgroundColor: 'rgba(34,34,34)',
      borderColor: 'transparent',
      textStyle: { color: 'rgba(255, 255, 255, 0.5)' },
    },
    series: [
      {
        data: daily.map(d => d.score || null),
        type: 'bar',
        itemStyle: {
          borderRadius: [20, 20, 0, 0],
          color: '#7c3aed',
        },
      },
    ],
  }

  const optionsByDurations: ECOption = {
    xAxis: {
      type: 'category',
      axisTick: { show: false },
      axisLine: { show: false },
      data: daily.map(d => `${dayjs.unix(d.date).date()}d`),
      axisLabel: { fontSize: '10px' },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: [
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.5)',
          ],
        },
      },

      axisLine: {
        show: false,
      },
      axisLabel: {
        fontSize: '10px',
        formatter: (value) => {
          return `${+dayjs.duration(value, 'seconds').format('HH')}`
        },
      },
      position: 'right',
      max: 36000,
      interval: 36000 / 5,
    },

    grid: { top: 32, left: 12, right: 26, bottom: 25 },
    tooltip: {
      trigger: 'axis',
      formatter: (series) => {
        const [params] = series as any
        const duration: number = (series as any[])
          .map((params: any) => params.value || 0)
          .reduce((prev, total) => prev + total, 0)

        if (duration === 0)
          return null as any

        const [hr, min] = dayjs.duration(duration, 'seconds')
          .format('HH:mm')
          .split(':')
          .map(Number)
          .filter(Boolean)

        return ReactDOMServer.renderToString(
          <div className="flex-col gap-4px">
            <div className="flex items-end gap-4px line-height-none">
              <span className="text-24px">
                {hr}
              </span>
              <span className="text-12px">Hr</span>
              <span className="text-24px">
                {min}
              </span>
              <span className="text-12px">Min</span>
            </div>
            <div className="text-12px">
              {params.axisValueLabel}
            </div>
          </div>,
        )
      },
      backgroundColor: 'rgba(34,34,34)',
      borderColor: 'transparent',
      textStyle: { color: 'rgba(255, 255, 255, 0.5)' },
    },
    legend: {
      textStyle: { color: 'rgba(255, 255, 255, 0.5)' },
      left: 2,
      itemWidth: 12,
      itemHeight: 8,
    },
    series: seriesWithBorder([
      {
        data: daily.map(d => d.durations?.dep),
        name: 'deep',
        type: 'bar',
        stack: 'sleep',
        color: '#2128B6',
      },
      {
        data: daily.map(d => d.durations?.lig),
        name: 'light',
        type: 'bar',
        stack: 'sleep',
        color: '#3083FD',
      },
      {
        data: daily.map(d => d.durations?.rem),
        name: 'REM',
        type: 'bar',
        stack: 'sleep',
        color: '#46BDFF',
      },
    ]),
  }

  const optionsByDistribution: ECOption = {
    xAxis: {
      type: 'category',
      axisTick: { show: false },
      axisLine: { show: false },
      data: daily.map(d => `${dayjs.unix(d.date).date()}d`),
      axisLabel: { fontSize: '10px' },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        fontSize: '10px',
        formatter: (value) => {
          const time = dayjs
            .duration({ hours: 21 })
            .subtract(value, 'seconds')
            .format('HH:mm')
          return `${time === '-3:00' ? '21:00' : time}`
        },
      },
      position: 'right',
      max: 86400,
      interval: 86400 / 6,
    },

    grid: { top: 20, left: 12, right: 38, bottom: 25 },
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
        data: daily.map((day) => {
          if (!day?.data?.length)
            return null
          const date = day.data.at(-1)?.date || 0
          const wake = dayjs.unix(date).format('HH:mm')
          const time = dayjs(wake, 'HH:mm')
          const point = dayjs('21:00', 'HH:mm')
          return point.diff(time, 'seconds')
        }),
      },
      {
        data: daily.map(d => d.durations?.tol),
        name: 'Sleep',
        type: 'bar',
        stack: 'Total',
        itemStyle: {
          borderRadius: 20,
          color: '#7c3aed',
        },
      },
    ],
  }
  return (
    <>
      <If cond={detail.data.length} else={<List dataSource={[]} />}>
        <Card size="small" className="px-6px py-4px my-18px">
          <div className="flex justify-between items-center mb-8px">
            <div className="flex items-center gap1">
              <div className="text-[#7c3aed] text-24px i-material-symbols-light-kid-star" />
              <span className="line-height-none text-15px">{t('Sleep quality score')}</span>
            </div>
          </div>
          <div className="">
            <span>{t('Average - jun')}</span>
            <span className="mx-4px text-24px font-bold line-height-none">{detail.score}</span>
            <span>{t('Points')}</span>
          </div>
          <div className="mb-12px">
            {evaluates[detail.eval]}
          </div>
          <If cond={last.data.length}>
            <Alert
              icon={detail.score > last.score
                ? <div className="i-material-symbols-arrow-warm-up-rounded text-white" />
                : <div className="i-material-symbols-arrow-cool-down-rounded text-white" />}
              message={detail.score > last.score
                ? t('points more last month average', { score: Math.abs(detail.score - last.score) })
                : t('ponits less last month average', { score: Math.abs(detail.score - last.score) })}
            />
          </If>

          <div className="h-180px rounded">
            <ReactECharts autoresize className="h-full" option={optionsByScores} />
          </div>
        </Card>
        <Card size="small" className="px-6px py-4px my-18px">
          <div className="flex justify-between items-center mb-8px">
            <div className="flex items-center gap1">
              <div className="text-[#7c3aed] text-24px i-solar-bed-bold" />
              <span className="line-height-none text-15px">{t('Sleep durations')}</span>
            </div>
          </div>
          <div className="mb-12px">
            <span>{t('Average - jun')}</span>
            <span className="mx-4px text-24px font-bold line-height-none">{hr}</span>
            <span>Hr</span>
            <span className="mx-4px text-24px font-bold line-height-none">{min}</span>
            <span>Min</span>
          </div>
          <If cond={last.data.length && difference !== '0 Min'}>
            <Alert
              icon={detail.duration > last.duration
                ? <div className="i-material-symbols-arrow-warm-up-rounded text-white" />
                : <div className="i-material-symbols-arrow-cool-down-rounded text-white" />}
              message={detail.duration > last.duration
                ? t('duration more last week average', { duration: difference })
                : t('duration more less week average', { duration: difference })}
            />
          </If>
          <div className="h-180px rounded">
            <ReactECharts autoresize className="h-full" option={optionsByDurations} />
          </div>
        </Card>
        <Card size="small" className="px-6px py-4px my-18px">
          <div className="flex justify-between items-center mb-8px">
            <div className="flex items-center gap1">
              <div className="text-[#7c3aed] text-24px i-tabler-haze-moon" />
              <span className="line-height-none text-15px">{t('Sleep distribution')}</span>
            </div>
          </div>
          <div className="mb-6x flex">
            <div className="w-110px">{t('Ave time to sleep')}</div>
            <span className="mx1"> - </span>
            <span className="font-bold">{detail.times.average.sleep}</span>
          </div>
          <div className="mb-12px flex">
            <div className="w-110px">{t('Ave wakeup time')}</div>
            <span className="mx1"> - </span>
            <span className="font-bold">{detail.times.average.wakes}</span>
          </div>
          <Alert message={t('Earliest wake-up latest bedtime', {
            wakeup: detail.times.earliest.wakes,
            sleep: detail.times.atlatest.sleep,
          })}
          />
          <div className="h-180px rounded">
            <ReactECharts autoresize className="h-full" option={optionsByDistribution} />
          </div>
        </Card>
        <Card size="small" className="px-6px py-4px my-18px" onClick={() => router.push('/device/sleep/tip')}>
          <div className="flex justify-between items-center">
            <span className="line-height-none">{t('Understanding Sleep')}</span>
            <div className="i-material-symbols-arrow-forward-ios-rounded" />
          </div>
        </Card>
      </If>
    </>
  )
}

interface AlertProps {
  message?: string
  icon?: ReactNode
}

function Alert(props: AlertProps) {
  return (
    <AAlert
      className="py4px px2 text-12px border-none bg-[#6d6d6d3b] mb-12px"
      message={props.message}
      type="success"
      icon={whenever(props.icon, icon => <div>{icon}</div>)}
      showIcon={!!props.icon}
    />
  )
}

function diffDurations(a: number, b: number) {
  const [hr, min] = dayjs.duration(Math.abs(a - b), 's')
    .format('HH:mm')
    .split(':').map(Number)
  return [hr, min] as const
}
