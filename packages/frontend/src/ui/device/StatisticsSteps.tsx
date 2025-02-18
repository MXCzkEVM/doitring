import { groupings, statistics } from '@doitring/analyzkit'
import { storeToState } from '@hairy/react-utils'
import { Card } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { contracts } from '@harsta/client'
import { useAsync } from 'react-use'
import { useMemo } from 'react'
import { IconContainer } from './IconContainer'
import { ECOption, ReactECharts, Trans } from '@/components'
import { store } from '@/store'
import { useProxyMiner } from '@/hooks'
import { whenever } from '@/utils'

export function StatisticsSteps() {
  const [steps] = storeToState(store.miner, 'steps')
  const [{ value: miner }] = useProxyMiner()

  const stats = statistics.steps.daily(steps)
  const detail = stats.daily.find(d => d.ytd === dayjs().format('YYYY-MM-DD'))
  const router = useRouter()
  const { t } = useTranslation()

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
      return days.map(ytd => stats.daily.find(d => d.ytd === ytd)?.total || 0)
    },
    [detail, stats],
  )

  const storage = contracts.Storage.resolve()
  const { value: total = 10000n } = useAsync(
    async () => {
      const total = await whenever(
        miner,
        () => storage.getItem(`ring_${miner!.sncode}`, 'steps'),
      )
      return total ? BigInt(total) : 10000n
    },
    [miner],
  )
  const evals = {
    high: t('Excellent in sports'),
    low: t('Sports are average'),
    lack: t('Lack of exercise'),
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
      axisLabel: { show: false },
      splitLine: { show: false },
      max: Number(total) * 1.5,
    },
    grid: { left: 0, right: 0, top: 10, bottom: 0 },
    series: [
      {
        data: pastSevenDays,
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: [20, 20, 0, 0],
          color: 'rgb(251, 191, 36, 0.8)',
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
    <Card className="border-none" size="small" onClick={() => router.push('/device/steps')}>
      <div className="flex items-center flex-wrap gap-x-6px  gap-y-8px mb-6px">
        <IconContainer className="bg-amber">
          <div className="i-ri-footprint-fill text-20px" />
        </IconContainer>
        <div className="flex flex min-w-110px items-center justify-between flex-1">
          <span className="font-bold text-15px sm:text-18px">
            {t('Steps Title')}
          </span>
          <span>{detail ? dayjs.unix(detail.date).format('MM/DD') : '--'}</span>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-x-12px">
        <div className="flex text-[rgba(255,255,255,0.45)]">
          <Trans
            step={<span className="mr-1">{detail?.total || '--'}</span>}
            i18nKey="Steps"
          />
        </div>
      </div>

      <div className="text-14px mb-12px">
        <span>{detail ? evals[detail.eval] : '--'}</span>
      </div>

      <div className="h-100px flex-col bg-black bg-opacity-30 rounded mt-12px">
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
