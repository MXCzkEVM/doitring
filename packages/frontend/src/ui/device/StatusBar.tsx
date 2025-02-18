/* eslint-disable no-empty-pattern */
import { Progress, Tooltip } from 'antd'
import { DetailedHTMLProps, If, storeToState, useWhenever } from '@hairy/react-utils'

import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useOverlayInject } from '@overlastic/react'
import { PropsWithChildren, ReactNode, useState } from 'react'
import { BonusProgress } from './BonusProgress'
import IconRing from '@/assets/images/ring-icon.png'
import { useProxyBluetooth, useProxyBluetoothCommand, useProxyUser } from '@/hooks'
import { store } from '@/store'
import { Card, PairRingDrawer, Trans } from '@/components'

export function StatusBar() {
  const [miner] = storeToState(store.miner, 'miner')
  const [{ value: user }] = useProxyUser()
  const [showStatus, setShowStatus] = useState(false)

  const { t } = useTranslation()

  return (
    <>
      <div className="font-bold text-16px mb-10px">
        <span>Ring </span>
        <span>{miner?.name}</span>
      </div>
      <Card>
        <div className="flex justify-between gap-12px mb-10px">
          <div
            className="flex-1 flex-center"
            onClick={() => setShowStatus(!showStatus)}
          >
            <BonusProgress cp={user?.score} sc={user?.pointInBasic} />
          </div>
          <div className="flex-1">
            <If
              cond={!showStatus}
              else={<PointsDetail onClick={() => setShowStatus(!showStatus)} />}
              then={<QuantityOfElectricity />}
            />
          </div>
        </div>

        <div className="flex justify-between text-14px mb-10px">
          <div className="flex-1 text-center">
            <span>
              {t('Update Time')}
              :
              {' '}
            </span>
            <span className="font-bold">
              {(user?.updateAt && dayjs(user.updateAt).format('MM/DD/YYYY')) || '--'}
            </span>
          </div>
          <div className="flex-1 text-center">
            <span>
              {t('Computing Power')}
              :
              {' '}
            </span>
            <span className="font-bold">
              {user?.score || 0}
              pts
            </span>
          </div>
        </div>

        <div className="text-14px h-24px flex-center bg-[#2B2B2B] rounded-5px mb-10px">
          {t('Stake more Blueberry and do more excercize')}
        </div>

        <div className="text-14px text-center mb-10px">
          <Trans
            i18nKey="You reached Point of your overall score"
            point={(
              <span>
                {(((user?.score || 0) / 400) * 100).toFixed(2)}
                %
              </span>
            )}
          />
        </div>

        <div className="text-12px text-center mb-10px">
          {t('Home Tips')}
        </div>
      </Card>
    </>
  )
}

function QuantityOfElectricity() {
  const openPairRingDrawer = useOverlayInject(PairRingDrawer)
  const [{ value: level }, fetchLevel] = useProxyBluetoothCommand('readLevel')
  const [{ value: { bluetooth } }] = useProxyBluetooth()
  const [{}, writeTime] = useProxyBluetoothCommand('writeTime')

  useWhenever(bluetooth, async () => {
    await writeTime(dayjs().format())
    await fetchLevel()
  }, { immediate: true })

  return (
    <div className="h-full flex-center" onClick={() => !bluetooth && openPairRingDrawer()}>
      <Card className="flex-1 max-w-120px h-120px flex-center bg-[#1D1D1D]">
        <img className="w-84px" src={IconRing.src} />
      </Card>
      <Tooltip title="The average battery lifespan is between 10-14 Days">
        <div className="h-full flex-col-center gap-6px">
          <div className="i-iconamoon-lightning-1" />
          <div className="flex-1 flex items-end bg-gray-4 bg-opacity-30 w-8px rounded-36">
            <div className="bg-[rgb(56,158,13)] w-8px rounded-36" style={{ height: `${level}%` }} />
          </div>
          <If cond={level}>
            <div className="text-12px">
              <span>{level || 0}</span>
              <span>%</span>
            </div>
          </If>
        </div>
      </Tooltip>
    </div>
  )
}

function PointsDetail(props?: PropsWithChildren<DetailedHTMLProps>) {
  const [{ value: user }] = useProxyUser()
  const points = JSON.parse(user?.pointInJsons || '{}')
  return (
    <Card className="bg-[#1D1D1D]" {...props}>
      <div className="flex items-center gap-8px mb-10px">
        <span className="i-material-symbols-arrow-back-rounded text-14px" />
        <span className="text-14px">Health Score</span>
      </div>
      <div className="flex-col gap-9px">
        <ScoreRow
          name="Sleep"
          icon={<div className="i-tabler-bed-flat-filled text-12px" />}
          score={points.sleep}
          color="#7B3AEC"
          total={30}
        />
        <ScoreRow
          name="Heart"
          icon={<div className="i-material-symbols-ecg-heart-sharp text-12px" />}
          score={points.rate}
          color="#FF6F6F"
          total={10}
        />
        <ScoreRow
          name="Oxygen"
          icon={<div className="i-hugeicons-blood text-12px" />}
          score={points.oxygen}
          color="#70ADF8"
          total={10}
        />
        <ScoreRow
          name="Steps"
          icon={<div className="i-ri-footprint-fill text-12px" />}
          score={points.step}
          color="#EC903A"
          total={30}
        />
        <ScoreRow
          name="Wearing"
          icon={<div className="i-material-symbols-nest-clock-farsight-analog-outline-rounded text-black text-12px" />}
          score={points.wearing}
          color="#fff"
          total={20}
        />
      </div>
    </Card>
  )
}

export interface ScoreRowProps {
  color: string
  icon: ReactNode
  name: string
  score: number
  total: number
}

function ScoreRow(props: ScoreRowProps) {
  const score = props.score || 0
  const point = (score / props.total) * 100

  return (
    <div className="flex items-center justify-between">
      <div className="flex-center gap-1">
        <div className="w-16px h-16px rounded-full flex-center" style={{ background: props.color }}>
          {props.icon}
        </div>
        <span className="text-12px" style={{ color: props.color }}>
          {props.name}
        </span>
      </div>
      <div className="flex-center" style={{ color: props.color }}>
        <span className="mr-5px text-10px">
          {score.toFixed(0)}
          /
          {props.total}
        </span>
        <Progress
          strokeColor={props.color}
          type="circle"
          percent={+point.toFixed(0)}
          size={15}
        />
      </div>
    </div>
  )
}
