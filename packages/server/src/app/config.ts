import dotenv from 'dotenv'

dotenv.config()

export type AppConfig = {
  port: number
}

const appConfig: AppConfig = {
  port: Number(process.env.PORT) || 3000,
}

export default appConfig
