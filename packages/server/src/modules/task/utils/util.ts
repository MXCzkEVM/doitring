import dayjs from 'dayjs'
import duration, { DurationUnitsObjectType } from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function getYesterdayInterval(startHour = 0, endHour = 23) {
  const yesterday = dayjs().day(dayjs().day() - 1).unix()
  const start = dayjs.unix(yesterday).hour(startHour).minute(0).second(0).millisecond(0).valueOf()
  const end = dayjs.unix(yesterday).hour(endHour).minute(0).second(0).millisecond(0).valueOf()
  return [new Date(start), new Date(end)] as const
}

export function getYesterdayIntervalSleep() {
  const yesterday = dayjs().day(dayjs().day() - 1).unix()
  const yesterday2 = dayjs().day(dayjs().day() - 2).unix()
  const start = dayjs.unix(yesterday2).hour(12).minute(0).second(0).millisecond(0).valueOf()
  const end = dayjs.unix(yesterday).hour(12).minute(0).second(0).millisecond(0).valueOf()
  return [new Date(start), new Date(end)] as const
}

export function isMep3355Format(memo: string) {
  try {
    const json = JSON.parse(JSON.parse(memo))
    return json.format === 'MEP-3355'
  }
  catch (error) {
    return false
  }
}

export function unixdur(units: DurationUnitsObjectType) {
  return BigInt(dayjs.duration(units).seconds())
}
