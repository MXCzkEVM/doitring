import dayjs from 'dayjs'
import { decompress } from '../../../utils'

export function isMep3355(memo: string) {
  try {
    return JSON.parse(memo).format === 'MEP-3355'
  }
  catch {
    return false
  }
}

export function parseDataJsonPacket(memo: string, sncode: string) {
  const content = JSON.parse(memo).data[0].content
  const dataJsonPacket: Record<string, any[]> = JSON.parse(decompress(content))
  function mapFilter(data: any[]) {
    return data
      .map((item) => {
        item.date = new Date(dayjs.unix(item.date).valueOf())
        item.sncode = sncode
        return item
      })
      .filter(item => item.value !== null || !item.date)
  }
  dataJsonPacket.sleeps = mapFilter(dataJsonPacket.sleeps)
  dataJsonPacket.oxygens = mapFilter(dataJsonPacket.oxygens)
  dataJsonPacket.rates = mapFilter(dataJsonPacket.rates)
  dataJsonPacket.steps = mapFilter(dataJsonPacket.steps)
  return dataJsonPacket
}
