import { eq } from 'drizzle-orm'
import db from '../../db/db'
import * as schema from '../../db/schema'

export default async function getCompany(companyId: string) {
  return await db
    .select()
    .from(schema.companies)
    .where(eq(schema.companies.id, companyId))
    .then((rows) => rows[0])
}
