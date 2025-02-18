import dayjs from 'dayjs'

const duid = {
  d: () => dayjs().format('YYYY-MM-DD'),
  w: () => `${dayjs().startOf('w').format('YYYY/MM/DD')}-${dayjs().endOf('w').format('YYYY/MM/DD')}`,
  M: () => dayjs().format('YYYY-MM'),
}

export function uuid(date: 'd' | 'w' | 'M') {
  return duid[date]()
}
