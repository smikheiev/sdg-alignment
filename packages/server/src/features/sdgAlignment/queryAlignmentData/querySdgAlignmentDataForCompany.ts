import { and, asc, eq, isNotNull } from 'drizzle-orm'
import * as schema from '../../../db/schema'
import db from '../../../db/db'

export default function querySdgAlignmentDataForCompany(companyId: string) {
  return db
    .select({
      alignmentStatus: schema.productToSdgAlignments.alignmentStatus,
      productId: schema.products.id,
      revenuePercentage: schema.companyProducts.revenuePercentage,
      sdgId: schema.sdgs.id,
    })
    .from(schema.companyProducts)
    .innerJoin(
      schema.products,
      eq(schema.products.id, schema.companyProducts.productId),
    )
    .leftJoin(
      schema.productToSdgAlignments,
      eq(
        schema.productToSdgAlignments.productId,
        schema.companyProducts.productId,
      ),
    )
    .innerJoin(
      schema.sdgs,
      eq(schema.sdgs.id, schema.productToSdgAlignments.sdgId),
    )
    .where(
      and(
        eq(schema.companyProducts.companyId, companyId),
        isNotNull(schema.productToSdgAlignments.alignmentStatus),
      ),
    )
    .orderBy(asc(schema.productToSdgAlignments.sdgId))
}
