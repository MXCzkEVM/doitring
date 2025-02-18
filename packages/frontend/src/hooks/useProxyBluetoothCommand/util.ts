/* eslint-disable unicorn/no-new-array */
export function radix16bcd(array: any[] | Uint8Array, no0x = false) {
  return Array.from(array).map((v) => {
    const s = v.toString(16)
    const b = `0x${s.length === 1 ? `0${s}` : s}`
    return no0x ? b.replace('0x', '') : b
  })
}

export function bcd(str: string) {
  return str.replace('0x', '')
}

export function splitArrayByLength<T>(arr: T[], length: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += length) {
    result.push(arr.slice(i, i + length))
  }
  return result
}

export interface Method {
  uid: number
  arg?: number[]
}

export function parseMethodBytes(method: Method, args: number[] = []) {
  const command = new Uint8Array([
    method.uid,
    ...new Array(15).fill(0x00),
  ])
  let ai = 0
  for (const index of method.arg || []) {
    command[index] = args[ai] || command[index]
    ai++
  }
  const last = command.length - 1
  const crc = Array.from(command)
    .splice(0, last - 1)
    .reduce((t, c) => t + c, 0)
  command[last] = crc & 0xFF
  return command
}
