import { and, asc, eq } from 'drizzle-orm'
import * as schema from '../../../db/schema'
import db from '../../../db/db'
import queryProductAlignmentsFromProductTree from './queryProductAlignmentsFromProductTree'

export default async function querySdgAlignmentDataForCompany(
  companyId: string,
) {
  const rows = await db
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
    .where(and(eq(schema.companyProducts.companyId, companyId)))
    .orderBy(asc(schema.productToSdgAlignments.sdgId))

  const productAlignmentsFromTree =
    await queryProductAlignmentsFromProductTree(companyId)

  const rowsWithResolvedAlignments = rows.map((row) => {
    if (row.alignmentStatus !== null) {
      return row
    }

    const parentAlignment = productAlignmentsFromTree.find(
      (productAlignmentFromTree) =>
        row.productId === productAlignmentFromTree.child_product_id,
    )
    if (parentAlignment) {
      return {
        ...row,
        alignmentStatus: parentAlignment.alignment_status,
      }
    }

    return null
  })

  return rowsWithResolvedAlignments.filter((row) => row !== null)
}
