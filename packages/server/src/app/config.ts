import dotenv from 'dotenv'

dotenv.config()

export type AppConfig = {
  databaseUrl: string
  port: number
}

const appConfig: AppConfig = {
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/development',
  port: Number(process.env.PORT) || 3000,
}

export default appConfig
