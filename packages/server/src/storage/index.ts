import path from 'node:path'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'

export const storage = createStorage({
  driver: fsDriver({ base: path.resolve(process.cwd(), 'cache') }),
})
