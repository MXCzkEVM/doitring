import dayjs from 'dayjs'

export function unixRange(date: number, unit: dayjs.ManipulateType) {
  return [
    dayjs.unix(date).startOf(unit).unix(),
    dayjs.unix(date).endOf(unit).unix(),
  ] as const
}
