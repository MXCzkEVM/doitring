import { Card } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { statistics } from '@doitring/analyzkit'
import { storeToState } from '@hairy/react-utils'
import { IconContainer } from './IconContainer'
import { ECOption, ReactECharts } from '@/components'
import { store } from '@/store'

export function StatisticsSleeps() {
  const router = useRouter()
  const { t } = useTranslation()
  const [sleeps] = storeToState(store.miner, 'sleeps')

  const stats = statistics.sleeps.daily(sleeps)
  const detail = stats.daily.find(d => d.ytd === dayjs().format('YYYY-MM-DD'))
  const [hr, min] = dayjs
    .duration(detail?.durations.tol || 0, 'second')
    .format('H:mm')
    .split(':')

  const pastSevenDays = useMemo(
    () => {
      const date = dayjs().unix()
      const days = [
        dayjs.unix(date).subtract(6, 'd').format('YYYY-MM-DD'),
        dayjs.unix(date).subtract(5, 'd').format('YYYY-MM-DD'),
        dayjs.unix(date).subtract(4, 'd').format('YYYY-MM-DD'),
        dayjs.unix(date).subtract(3, 'd').format('YYYY-MM-DD'),
        dayjs.unix(date).subtract(2, 'd').format('YYYY-MM-DD'),
        dayjs.unix(date).subtract(1, 'd').format('YYYY-MM-DD'),
        dayjs.unix(date).format('YYYY-MM-DD'),
      ]
      return days.map(ytd =>
        stats.daily.find(d => d.ytd === ytd)?.durations.tol
        || 0)
    },
    [detail, stats],
  )

  const evals = {
    high: t('Good quality'),
    normal: t('Needs improvement'),
    low: t('Poor quality'),
  }

  const options: ECOption = {
    xAxis: {
      type: 'category',
      data: [0, 0, 0, 0, 0, 0, 0],
      axisLine: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { show: false },
      max: 28800,
    },
    grid: { left: 0, right: 0, top: 10, bottom: 0 },
    series: [
      {
        data: pastSevenDays,
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: [20, 20, 0, 0],
          color: '#7c3aed',
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
          borderRadius: [20, 20, 0, 0],
        },
      },
    ],
  }

  return (
    <Card className="border-none" size="small" onClick={() => router.push('/device/sleep')}>
      <div className="flex items-center flex-wrap gap-x-6px  gap-y-8px mb-6px">
        <IconContainer className="bg-[#7c3aed]">
          <div className="i-tabler-bed-flat-filled text-20px" />
        </IconContainer>
        <div className="flex flex min-w-110px items-center justify-between flex-1">
          <span className="font-bold text-15px sm:text-18px">
            {t('Sleep')}
          </span>
          <span>{detail ? dayjs.unix(detail.date).format('MM/DD') : '--'}</span>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-x-12px">
        <div className="flex">
          <div className="flex gap-4px">
            <span className="text-[rgba(255,255,255,0.8)]">{detail ? hr : '--'}</span>
            <span className="text-[rgba(255,255,255,0.6)]">hr</span>
            <span className="text-[rgba(255,255,255,0.8)]">{detail ? min : '--'}</span>
            <span className="text-[rgba(255,255,255,0.6)]">min</span>
          </div>
        </div>
      </div>
      <div className="text-14px mb-12px">
        {detail ? evals[detail.evals.com] : '--'}
      </div>
      <div className="h-100px flex-col bg-black bg-opacity-30 rounded">
        <div className="flex-col flex-1 p8px pt4px">
          <div className="flex-1">
            <ReactECharts className="h-full" autoresize option={options} />
          </div>
          <div className="flex justify-between text-10px px-1">
            <div>
              {detail
                ? dayjs.unix(detail.date).subtract(6, 'd').format('MM/DD')
                : dayjs().subtract(6, 'd').format('MM/DD')}
            </div>
            <div>
              {detail
                ? dayjs.unix(detail.date).format('MM/DD')
                : dayjs().format('MM/DD')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
