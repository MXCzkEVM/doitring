import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  withEthersHttpProxy,
  withNestjsCors,
  withNestjsListen,
  withNestjsRepairDecimal,
  withNestjsSwagger,
} from './bootstrap'

async function bootstrap() {
  const { NEST_SERVER_PORT, NODE_ENV } = process.env
  const app = await NestFactory.create(AppModule)

  if (NODE_ENV === 'development')
    withEthersHttpProxy({ host: '127.0.0.1', port: 7890 })
  withNestjsRepairDecimal(app)
  withNestjsSwagger(app)
  withNestjsCors(app)
  withNestjsListen(app, NEST_SERVER_PORT)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
