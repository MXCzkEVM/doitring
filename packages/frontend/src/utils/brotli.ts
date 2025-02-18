/* eslint-disable node/prefer-global/buffer */
import Brotli from 'brotli-wasm'

export async function compress(str: string) {
  const brotli = await Brotli.then(brotli => brotli)
  const uncompressed = Buffer.from(str)
  const compressed = brotli.compress(uncompressed)
  return Buffer.from(compressed).toString('base64')
}

export async function decompress(str: string) {
  const brotli = await Brotli.then(brotli => brotli)
  const data = brotli.decompress(Buffer.from(str, 'base64'))
  return Buffer.from(data).toString('utf-8')
}
