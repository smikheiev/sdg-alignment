import db from '../../db/db'
import * as schema from '../../db/schema'

export default async function getCompanies() {
  return await db.select().from(schema.companies)
}
