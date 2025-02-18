import { statistics } from '@doitring/analyzkit'
import { If, storeToState } from '@hairy/react-utils'
import { Card } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { IconContainer } from './IconContainer'
import { ECOption, ReactECharts } from '@/components'
import { store } from '@/store'

export function StatisticsRates() {
  const [rates] = storeToState(store.miner, 'rates')

  const stats = statistics.rates.daily(rates)
  const detail = stats.daily.find(d => d.ytd === dayjs().format('YYYY-MM-DD'))
  const router = useRouter()
  const { t } = useTranslation()

  const evals = {
    normal: t('Normal'),
    abnormal: t('Abnormal'),
  }

  const hours = detail?.hours.filter(d => d.average) || []

  const heartOptions: ECOption = {
    xAxis: {
      type: 'category',
      data: hours.map(d => d.hour),
      axisLine: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      max: 120,
      axisLine: { show: false },
      splitLine: { show: false },
    },
    grid: { left: 0, right: 0, top: 5, bottom: 0 },
    series: [
      {
        lineStyle: {
          width: 1,
        },
        showSymbol: false,
        color: '#f87171',
        data: hours.map(d => d.average).map(val => !val ? null : val),
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(248,113,113,5)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(0,0,0,0)', // 100% 处的颜色
              },
            ],
          },

        },
      },
    ],
  }

  return (
    <Card className="border-none" size="small" onClick={() => router.push('/device/rates')}>
      <div className="flex items-center flex-wrap gap-x-6px  gap-y-8px mb-6px">
        <IconContainer className="bg-red">
          <div className="i-material-symbols-ecg-heart-sharp text-20px" />
        </IconContainer>
        <div className="flex min-w-110px items-center justify-between flex-1">
          <span className="font-bold text-15px sm:text-18px">
            {t('Heart Rate')}
          </span>
          <span>{detail ? dayjs.unix(detail.date).format('MM/DD') : '--'}</span>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-x-12px">
        <div className="flex text-[rgba(255,255,255,0.45)]">
          <If cond={detail} else={<span className="mr-1">--</span>}>
            <span>{detail?.min || '--'}</span>
            <span>~</span>
            <span className="mr-1">{detail?.max || '--'}</span>
          </If>

          <span>bpm</span>
        </div>
      </div>
      <div className="text-14px mb-12px">
        {detail ? `${detail.average} bpm - ${evals[detail.eval]}` : '--'}
      </div>

      <div className="h-100px flex-col bg-black bg-opacity-30 rounded mt-12px">
        <div className="flex-col flex-1 p8px pt4px">
          <ReactECharts autoresize className="flex-1" option={heartOptions} />
          <div className="flex justify-between text-10px">
            <div>00:00</div>
            <div>{hours.at(-1)?.hour || '24:00'}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
