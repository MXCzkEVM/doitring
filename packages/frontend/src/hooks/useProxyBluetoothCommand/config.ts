/* eslint-disable prefer-promise-reject-errors */
import dayjs from 'dayjs'
import uniqWith from 'lodash/uniqWith'
import { bcd, parseMethodBytes, radix16bcd, splitArrayByLength } from './util'

export type GetType = 'last' | 'pos' | 'next' | 'delete'

export const GetMappings = { last: 0, pos: 1, next: 2, delete: 99 }

export const Methods = {
  readLevel: { uid: 0x13, arg: [1] },
  readVersion: { uid: 0x27 },
  readTime: { uid: 0x41 },
  readSteps: { uid: 0x52, arg: [1], frag: true },
  readSleep: { uid: 0x53, arg: [1, 2, 3], frag: true },
  readHeartRates: { uid: 0x55, arg: [1, 2, 3], frag: true },
  readBloodOxygens: { uid: 0x66, arg: [1, 2, 3], frag: true },
  writeTime: { uid: 0x01, arg: [1, 2, 3, 4, 5, 6] },
  writeRestore: { uid: 0x12, arg: [] },
}

export const Commands = {
  readLevel: () => parseMethodBytes(Methods.readLevel),
  readVersion: () => parseMethodBytes(Methods.readVersion),
  readTime: () => parseMethodBytes(Methods.readTime),
  readSteps: (type: GetType = 'last') => parseMethodBytes(Methods.readSteps, [GetMappings[type]]),
  readSleep: (type: GetType = 'last') => parseMethodBytes(Methods.readSleep, [GetMappings[type], Number('0x05'), Number('0x15')]),
  readHeartRates: (type: GetType = 'last') => parseMethodBytes(Methods.readHeartRates, [GetMappings[type]]),
  readBloodOxygens: (type: GetType = 'last') => parseMethodBytes(Methods.readBloodOxygens, [GetMappings[type]]),
  writeRestore: () => parseMethodBytes(Methods.writeRestore),
  writeTime: (date: string) => {
    const args = [
      `0x${dayjs(date).format('YY')}`,
      `0x${dayjs(date).format('MM')}`,
      `0x${dayjs(date).format('DD')}`,
      `0x${dayjs(date).format('HH')}`,
      `0x${dayjs(date).format('mm')}`,
      `0x${dayjs(date).format('ss')}`,
    ]
    return parseMethodBytes(Methods.writeTime, args.map(Number))
  },
}

export const Resolves = {
  readLevel: (data: Uint8Array) => data[1],
  readVersion: (data: Uint8Array) => {
    const [_, aa, bb, cc, dd] = radix16bcd(data, true).map(Number)
    return `${aa}.${bb}${cc}${dd}`
  },
  readTime: (data: Uint8Array) => {
    const [_, YY, MM, DD, HH, mm, SS] = data
    return dayjs.unix(parseDate([YY, MM, DD, HH, mm, SS])).format()
  },
  writeTime: (data: Uint8Array) => {
    return data[0] === 0x81
      ? Promise.reject()
      : Promise.resolve()
  },
  readSleep: (data: Uint8Array) => {
    const group = splitArrayByLength(radix16bcd(data), 130)

      .filter(item => +item[1] !== 0xFF)
      .map((item) => {
        const [_, id1, id2, YY, MM, DD, HH, mm, SS, LED, ...sleeps] = item
        const date = parseDate([YY, MM, DD, HH, mm, SS])
        return {
          id: parseInt([id1, id2]),
          sleeps: sleeps.map(Number),
          length: Number(LED),
          date,
        }
      })

    const value = uniqWith(group, (a, b) => a.date === b.date)
      .flatMap(item =>
        item.sleeps
          .map((value, index) => {
            const date = item.date + (index * 60)
            return {
              date,
              value,
            }
          })
          .filter(({ value }) => !!value),
      )
      .sort((a, b) => a.date - b.date)

    return value
  },
  readSteps: (data: Uint8Array) => {
    return splitArrayByLength(radix16bcd(data), 25)
      .filter(item => +item[1] !== 0xFF)
      .map((item) => {
        const [_, _id1, _id2, YY, MM, DD, HH, mm, SS, S1, S2, K1, K2, D1, D2, ..._steps] = item
        const date = parseDate([YY, MM, DD, HH, mm, SS])
        return {
          value: parseInt([S1, S2]),
          kcal: parseInt([K1, K2]) / 100,
          km: parseInt([D1, D2]) / 100,
          date,
        }
      })
      .sort((a, b) => a.date - b.date)
  },
  readHeartRates: (data: Uint8Array) => {
    return splitArrayByLength(radix16bcd(data), 10)
      .filter(item => +item[1] !== 0xFF)
      .map((item) => {
        const [_, _id1, _id2, YY, MM, DD, HH, mm, SS, hh] = item
        const date = parseDate([YY, MM, DD, HH, mm, SS])
        return {
          value: Number(hh),
          date,
        }
      })
      .filter(({ value }) => !!value)
      .sort((a, b) => a.date - b.date)
  },
  readBloodOxygens: (data: Uint8Array) => {
    return splitArrayByLength(radix16bcd(data), 10)
      .filter(item => +item[1] !== 0xFF)
      .map((item) => {
        const [_, _id1, _id2, YY, MM, DD, HH, mm, SS, value] = item
        const date = parseDate([YY, MM, DD, HH, mm, SS])
        return {
          value: +value,
          date,
        }
      })
      .sort((a, b) => a.date - b.date)
  },
  writeRestore: (data: Uint8Array) => {
    return data[0] === 0x12
      ? Promise.resolve()
      : Promise.reject()
  },
}

function parseDate(data: (string | number)[]) {
  const [YY, MM, DD, HH, mm, SS] = radix16bcd(data.map(Number))
  const ymd = [`20${YY}`, MM, DD].map(bcd).join('-')
  const hms = [HH, mm, SS].map(bcd).join(':')
  const time = `${ymd} ${hms}`
  return dayjs(time, 'YYYY-MM-DD HH:mm:ss').unix()
}

function parseInt(data: (string | number)[]) {
  return +`0x${radix16bcd(data, true).map(d => d.replace('0x', '')).reverse().join('')}`
}
