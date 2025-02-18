import dayjs from 'dayjs'
import { useAsync } from 'react-use'
import { getSeason } from '@/api'
import { riposte } from '@/utils'
import { levelOptions as levels } from '@/config'

export function useGroupLimit(group?: number) {
  const { value: season } = useAsync(
    async () => group
      ? getSeason({
        date: dayjs().subtract(1, 'month').format(),
        group,
      })
      : undefined,
    [group],
  )
  const health = BigInt(season?.locked || 0)
  const points = season?.score || 0
  const level = riposte(
    [points > levels[3].points && health > levels[3].health, 3],
    [points > levels[2].points && health > levels[2].health, 2],
    [true, 1],
  )!
  return { 1: 50, 2: 200, 3: 500 }[level]!
}
