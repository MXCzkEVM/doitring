import { If } from '@hairy/react-utils'
import { Button, Card, Modal, Progress, Tag, TimePicker, TimePickerProps } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { statistics } from '@doitring/analyzkit'
import { useExtendOverlay, useOverlayInject } from '@overlastic/react'
import { RangePickerProps } from 'antd/es/date-picker'
import { contracts } from '@harsta/client'
import { useAsyncFn } from 'react-use'
import { Duration } from './components/Duration'
import { DetailProps } from './types'
import { HealthConsult, ProgressWithRange } from '@/components'
import { useProxyMiner } from '@/hooks'

export function Day(props: DetailProps) {
  const openTimePickerModal = useOverlayInject<unknown, [string, string]>(TimePickerModal)
  const storage = contracts.Storage.resolve()
  const { t } = useTranslation()
  const router = useRouter()
  const [{ value: miner }] = useProxyMiner()

  const [interval, setInterval] = useState(true)
  const detail = statistics.sleeps.day(props.date, props.data)
  const [{ value: times = ['12:00', '08:00'] }, reloadTimes] = useAsyncFn(
    async () => Promise.all([
      storage.getItem(`ring_${miner?.sncode}`, 'startOf'),
      storage.getItem(`ring_${miner?.sncode}`, 'endOf'),
    ]),
    [miner],
  )

  async function updateTimes() {
    const times = await openTimePickerModal()
    await storage.setStorage(
      `ring_${miner?.sncode}`,
      [
        ['startOf', times[0]],
        ['endOf', times[1]],
      ],
    )
    await reloadTimes()
  }

  function duration(num?: number) {
    return dayjs.duration(num || 0, 'seconds')
  }

  const evals = {
    high: t('Good quality'),
    normal: t('Needs improvement'),
    low: t('Poor quality'),
  }

  return (
    <>
      <Card size="small" className="px-6px py-4px my-18px">
        <div className="flex justify-between items-center">
          <span className="text-15px">{t('Sleep evaluation')}</span>
          <div className="flex items-center gap-4px">
            <div className="text-13px">
              {detail?.evals?.com ? evals[detail.evals.com] : '--'}
            </div>
            <span
              className="i-tabler-alert-circle text-base translate-y-1px"
              onClick={() => router.push('/device/sleep/eval')}
            />
          </div>
        </div>
      </Card>
      <Card size="small" className="px-6px py-4px my-18px">
        <div className="flex justify-between">
          <div className="flex-col gap-8px">
            <div className="text-15px">{t('Actual Sleep duration')}</div>
            <Duration className="text-18px" date={detail?.durations.act} />
            <div className="text-white text-opacity-50">
              {t('Total duration of sleep', {
                duration: t('Duration Text', {
                  minute: duration(detail?.durations.tol).minutes() || '-',
                  hour: duration(detail?.durations.tol).hours() || '-',
                }),
              })}
            </div>
          </div>
          <Progress
            type="circle"
            percent={detail?.score}
            size={80}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={percent => (
              <div className="flex-col-center gap-4px">
                <span className="font-bold text-24px">{percent}</span>
                <span className="text-12px">{t('Average')}</span>
              </div>
            )}
          />
        </div>

      </Card>

      <Card size="small" className="px-6px py-4px my-18px">
        <div className="flex items-center justify-between gap-8px">
          <div className="text-15px">{t('Sleep schedule')}</div>
          <div className="flex items-center" onClick={updateTimes}>
            <div>{times[0]}</div>
            <div className="mx-2px">-</div>
            <div>{times[1]}</div>
            <div className="ml-8px i-material-symbols-edit text-16px" />
          </div>
        </div>
      </Card>

      <If
        else={<div className="flex-center">{t('Not Data Sync Data')}</div>}
        cond={detail.data.length}
      >
        <Card size="small" className="px-6px py-4px my-18px">
          <div className="flex justify-between items-center mb-12px">
            <div className="flex-center gap-4px">
              <span className="text-15px">{t('Sleep structure')}</span>
            </div>
            <Button
              onClick={() => setInterval(v => !v)}
              shape="round"
              size="small"
            >
              <span>{t('Range')}</span>
              <If
                cond={interval}
                then={<div className="i-icon-park-outline-preview-open" />}
                else={<div className="i-icon-park-outline-preview-close" />}
              />
            </Button>
          </div>
          <div className="my-12px text-12px text-white text-opacity-50">
            {t('Sleep structure Tip')}
          </div>
          <div className="flex-col gap-8px">
            <div className="flex-col">
              <div className="text-18px mb-8px">
                <span className="text-white text-opacity-75 font-bold">{t('Deep sleep')}</span>
                <If cond={detail?.durations.dep}>
                  <Duration className="text-14px mr-8px" date={detail?.durations.dep} />
                  <Tag color="orange">{detail?.evals.dep}</Tag>
                </If>

              </div>
              <div className="h-36px">
                <ProgressWithRange
                  showRange={interval}
                  color="#7248F2"
                  percent={detail?.percents.dep}
                  range={[20, 40]}
                />
              </div>
            </div>
            <div className="flex-col">
              <div className="text-18px mb-8px">
                <span className="text-white text-opacity-75 font-bold">{t('Light sleep')}</span>
                <If cond={detail?.durations.dep}>
                  <Duration className="text-14px mr-8px" date={detail?.durations.lig} />
                  <Tag color="orange">{detail?.evals.lig}</Tag>
                </If>
              </div>
              <div className="h-36px">
                <ProgressWithRange
                  showRange={interval}
                  color="#B38EF6"
                  percent={detail?.percents.lig}
                  range={[60, 80]}
                />
              </div>
            </div>
            <div className="flex-col">
              <div className="text-18px mb-8px">
                <span className="text-white text-opacity-75 font-bold">{t('REM')}</span>
                <If cond={detail?.durations.rem}>
                  <Duration className="text-14px mr-8px" date={detail?.durations.rem} />
                  <Tag color="orange">{detail?.evals.rem}</Tag>
                </If>
              </div>
              <div className="h-36px">
                <ProgressWithRange
                  showRange={interval}
                  color="#D9C6FB"
                  percent={detail?.percents.rem}
                  range={[10, 30]}
                />
              </div>
            </div>
          </div>
        </Card>
      </If>
    </>
  )
}

function TimePickerModal() {
  const { visible, reject, resolve } = useExtendOverlay({
    duration: 300,
  })
  const [time, setTime] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>()
  const onChange: RangePickerProps['onChange'] = time => setTime(time || undefined)
  return (
    <Modal
      onCancel={reject}
      title="Change Sleep schedule"
      open={visible}
      centered
      okButtonProps={{ disabled: !(time?.[0] && time?.[1]) }}
      onOk={() => resolve([time?.[0]?.format('HH:mm'), time?.[1]?.format('HH:mm')])}
    >
      <div className="flex-center">
        <TimePicker.RangePicker value={time} onChange={onChange} />
      </div>
    </Modal>
  )
}
