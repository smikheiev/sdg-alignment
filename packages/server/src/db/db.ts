import { drizzle } from 'drizzle-orm/node-postgres'
import config from '../app/config'

const db = drizzle({
  connection: config.databaseUrl,
  casing: 'snake_case',
})

export default db
