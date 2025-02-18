/* eslint-disable node/prefer-global/buffer */
import { compress as _compress, decompress as _decompress } from 'brotli-wasm'

export function compress(str: string) {
  const uncompressed = Buffer.from(str)
  const compressed = _compress(uncompressed)
  return Buffer.from(compressed).toString('base64')
}

export function decompress(str: string) {
  const data = _decompress(Buffer.from(str, 'base64'))
  return Buffer.from(data).toString('utf-8')
}
