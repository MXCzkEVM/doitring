import { statistics } from '@doitring/analyzkit'
import { If, storeToState } from '@hairy/react-utils'
import { Card } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { IconContainer } from './IconContainer'
import { ECOption, ReactECharts } from '@/components'
import { store } from '@/store'

export function StatisticsBloods() {
  const [oxygens] = storeToState(store.miner, 'oxygens')

  const stats = statistics.oxygens.daily(oxygens)
  const detail = stats.daily.find(d => d.ytd === dayjs().format('YYYY-MM-DD'))

  const router = useRouter()
  const { t } = useTranslation()

  const evals = {
    normal: t('Normal'),
    abnormal: t('Abnormal'),
    danger: t('Danger'),
  }

  const hours = detail?.hours.filter(d => d.average) || []
  const options: ECOption = {
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
      min: 40,
    },
    grid: { left: -15, right: -15, top: 5, bottom: 0 },
    series: [
      {
        data: hours.map(o =>
          o.average! < 95
            ? { value: o.average, itemStyle: { color: 'rgb(26, 114, 194, 0.8)' } }
            : o.average,
        ),
        type: 'line',
        showSymbol: false,
        areaStyle: {
          color: 'rgba(26, 114, 194, .2)',
        },
        itemStyle: {
          color: 'rgba(26, 114, 194, .6)',
        },
      },
    ],
  }

  return (
    <Card className="border-none" size="small" onClick={() => router.push('/device/oxygens')}>
      <div className="flex items-center flex-wrap gap-x-6px  gap-y-8px mb-6px">
        <IconContainer className="bg-[rgba(26,114,194)]">
          <div className="i-hugeicons-blood text-20px" />
        </IconContainer>
        <div className="flex flex min-w-110px items-center justify-between flex-1">
          <span className="font-bold text-15px sm:text-18px">
            SaO2
          </span>
          <span>{detail ? dayjs.unix(detail.date).format('MM/DD') : '--'}</span>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-x-12px">
        <div className="flex text-[rgba(255,255,255,0.45)]">
          <If cond={detail} else={<span className="mr-2">--</span>}>
            <span>{detail?.min || '--'}</span>
            <span>~</span>
            <span>{detail?.max || '--'}</span>
          </If>
          <span>%</span>
        </div>
      </div>
      <div className="text-14px mb-12px">
        {detail ? `${detail.average}% - ${evals[detail.eval]}` : '--'}
      </div>

      <div className="h-100px flex-col bg-black bg-opacity-30 rounded mt-12px">
        <div className="flex-col flex-1 p8px pt4px">
          <ReactECharts autoresize className="flex-1" option={options} />
          <div className="flex justify-between text-10px">
            <div>00:00</div>
            <div>{hours.at(-1)?.hour || '24:00'}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
