import { Button, List, Spin, Statistic } from 'antd'
import dayjs from 'dayjs'

import { useState } from 'react'
import { If } from '@hairy/react-utils'
import { useAsync } from 'react-use'
import { LevelProgress } from './LevelProgress'
import { MemberLeaderboard } from './MemberLeaderboard'
import { getSeason, getSeasonMembers } from '@/api'
import { useProxyMiner } from '@/hooks'
import { whenever } from '@/utils'

export function Season() {
  const [date, setDate] = useState(dayjs().format())

  const lasted = dayjs(date).isSame(dayjs(), 'month')
  const [{ value: miner }] = useProxyMiner()

  const { value: season, loading } = useAsync(
    () => getSeason({ date, group: miner!.group! }),
    [date, miner],
  )

  function prev() {
    setDate(dayjs(date).subtract(1, 'month').format())
  }
  function next() {
    setDate(dayjs(date).add(1, 'month').format())
  }

  return (
    <div className="flex-col">
      <div className="mx-32px flex items-center justify-between mb-24px">
        <Button size="small" type="text" onClick={prev}>
          <div className="i-solar-alt-arrow-left-bold-duotone text-24px" />
        </Button>
        <div className="flex-col gap-1">
          <div className="text-12px flex-center font-[spacex] gap-2">
            <div>World</div>
            <div>-</div>

            <div className="">{season?.rank || 'none'}</div>
          </div>
          <div className="text-center text-[rgba(255,255,255,0.65)] h-14px">
            <If
              cond={lasted}
              else={
                <span className="font-[Merriweather]">{dayjs(date).format('YYYY-MM')}</span>
              }
            >
              <Statistic.Countdown
                valueStyle={{
                  fontSize: '14px',
                  fontFamily: 'Merriweather',
                  color: 'rgba(255,255,255,0.65)',
                }}
                rootClassName="text-red text-12px"
                value={dayjs().endOf('month').valueOf()}
                format="H[h] mm[m] [Remaining]"
              />
            </If>

          </div>
        </div>
        <Button size="small" type="text" disabled={lasted} onClick={next}>
          <div className="i-solar-alt-arrow-right-bold-duotone text-24px" />
        </Button>
      </div>
      <Spin spinning={loading}>
        <If cond={!loading} else={<div className="h-400px" />}>
          <If cond={season} else={<List dataSource={[]} />}>
            <LevelProgress season={season!} />
            <MemberLeaderboard season={season!} />
          </If>
        </If>
      </Spin>

    </div>
  )
}
