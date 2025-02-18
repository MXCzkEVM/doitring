import { dirname, join } from 'node:path'
import { cwd } from 'node:process'
import * as fs from 'fs-extra'

const INDEXER_SCAN_LAST_BLOCK_FILEPATH = join(cwd(), 'cache', '.indexer')

export async function setIndexerLastBlock(blockNumber: number) {
  if (Number.isNaN(blockNumber) || typeof blockNumber !== 'number')
    throw new Error(`setIndexerLastBlock Error ${blockNumber}`)
  await fs.ensureDir(dirname(INDEXER_SCAN_LAST_BLOCK_FILEPATH))
  await fs.writeFile(INDEXER_SCAN_LAST_BLOCK_FILEPATH, blockNumber.toString(), {
    flag: 'w',
  })
}

export async function getIndexerLastBlock() {
  try {
    return Number(await fs.readFile(INDEXER_SCAN_LAST_BLOCK_FILEPATH, 'utf-8'))
  }
  catch {
    return Number(process.env.NEST_DEFAULT_LAST_BLOCK!)
  }
}
