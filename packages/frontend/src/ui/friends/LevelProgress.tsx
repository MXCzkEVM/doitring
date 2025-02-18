import { formatEther, parseEther } from 'ethers'
import { Progress } from 'antd'
import { Card as MCard } from 'antd-mobile'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Season } from '@/api/index.type'
import { percentage, riposte } from '@/utils'
import { levelOptions as levels } from '@/config'
import { Trans } from '@/components'

export interface LevelProgressProps {
  season: Season
}
export function LevelProgress(props: LevelProgressProps) {
  const health = BigInt(props.season.locked)
  const points = props.season.score
  const { t } = useTranslation()

  const messages: Record<string, string> = {
    1: t('Daily Boost level 1'),
    2: t('Daily Boost level 2'),
    3: t('Daily Boost level 3'),
  }

  const currLevel = riposte(
    [points > levels[3].points && health > levels[3].health, 3],
    [points > levels[2].points && health > levels[2].health, 2],
    [true, 1],
  )!
  const nextLevel = levels[currLevel + 1]
  const percent = useMemo(
    () => {
      if (!nextLevel)
        return { health: 100, points: 100, total: 100 }
      const _health = percentage(nextLevel.health.toString(), health.toString(), 0)
      const _points = percentage(nextLevel.points.toString(), points.toString(), 0)
      const _total = percentage(200, _health + _points)
      return {
        health: _health,
        points: _points,
        total: _total,
      }
    },
    [points, health, nextLevel],
  )

  return (
    <>
      <MCard className="mx-17px mb-24px">
        <div className="flex items-center justify-between mb-8px">
          <span className="font-bold">{t('Progress')}</span>
          <span className="font-[spacex] text-12px">
            Level
            {' '}
            {currLevel}
          </span>
        </div>
        <Progress
          percent={percent.total}
          strokeColor="#234F9B"
        />
        <div className="text-[rgba(255,255,255,0.5)]">
          {messages[currLevel]}
        </div>
      </MCard>
      <div className="mx-17px mb-12px flex-col gap-8px">
        <div className="flex items-center gap-2">
          <Progress
            type="circle"
            size={16}
            percent={percent.health}
          />
          <span className="flex-1 text-12px text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Noto Sans' }}>
            <Trans i18nKey="Group Level condition 1" amount={formatEther(levels[currLevel].health)} />
          </span>
          <span>
            {percent.health}
            %
          </span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Progress
            type="circle"
            size={16}
            percent={percent.points}
          />
          <span className="flex-1 text-12px text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Noto Sans' }}>
            <Trans i18nKey="Group Level condition 2" amount={formatEther(levels[currLevel].health)} />
          </span>
          <span>
            {percent.points}
            %
          </span>
        </div>
      </div>
    </>
  )
}
