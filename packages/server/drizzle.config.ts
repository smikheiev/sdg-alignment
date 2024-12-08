import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import config from './src/app/config'

export default defineConfig({
  casing: 'snake_case',
  dbCredentials: {
    url: config.databaseUrl,
  },
  dialect: 'postgresql',
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
  out: './dbMigrations',
  schema: './src/db/schema.ts',
  verbose: true,
})
