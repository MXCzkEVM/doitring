import { defineConfig } from '@genapi/cli'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  input: `${process.env.NEXT_PUBLIC_SERVER_URL}/swagger/json`,
  pipeline: 'swag-fetch-ts',
  baseURL: 'process.env.NEXT_PUBLIC_SERVER_URL',
  output: {
    main: 'src/api/index.ts',
    type: 'src/api/index.type.ts',
  },
})
