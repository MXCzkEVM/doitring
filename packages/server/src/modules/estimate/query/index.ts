import dayjs from 'dayjs'
import { RingService } from '../../ring'

export async function queryRingManys(ring: RingService) {
  const intervalByYesterday = yesterdayInterval()
  const intervalBySleep = yesterdaySleepInterval()
  const coomonManyQuery = { where: { date: { gt: intervalByYesterday[0], lt: intervalByYesterday[1] } } }
  const sleepsManyQuery = { where: { date: { gt: intervalBySleep[0], lt: intervalBySleep[1] } } }
  const [sleeps, steps, rates, oxygens] = await Promise.all([
    ring.listsBySleep(sleepsManyQuery).then(data => data.map(d => ({ ...d, date: dayjs(d.date).unix() }))),
    ring.listsByStep(coomonManyQuery).then(data => data.map(d => ({ ...d, date: dayjs(d.date).unix() }))),
    ring.listsByHeartRate(coomonManyQuery).then(data => data.map(d => ({ ...d, date: dayjs(d.date).unix() }))),
    ring.listsByBloodOxygen(coomonManyQuery).then(data => data.map(d => ({ ...d, date: dayjs(d.date).unix() }))),
  ])
  return { sleeps, steps, rates, oxygens }
}

export function yesterdayInterval() {
  const yesterday = dayjs().day(dayjs().day() - 1).unix()
  const start = dayjs.unix(yesterday).hour(0).minute(0).second(0).millisecond(0).valueOf()
  const end = dayjs.unix(yesterday).hour(23).minute(0).second(0).millisecond(0).valueOf()
  return [new Date(start), new Date(end)] as const
}

export function yesterdaySleepInterval() {
  const yesterday = dayjs().day(dayjs().day() - 1).unix()
  const yesterday2 = dayjs().day(dayjs().day() - 2).unix()
  const start = dayjs.unix(yesterday2).hour(12).minute(0).second(0).millisecond(0).valueOf()
  const end = dayjs.unix(yesterday).hour(12).minute(0).second(0).millisecond(0).valueOf()
  return [new Date(start), new Date(end)] as const
}
