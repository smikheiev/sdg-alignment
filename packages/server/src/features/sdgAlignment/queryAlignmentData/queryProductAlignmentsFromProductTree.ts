import { sql } from 'drizzle-orm'
import { camelCase } from 'change-case'
import db from '../../../db/db'
import * as schema from '../../../db/schema'

type Output = {
  productId: string
  productName: string
  childProductId: string
  childProductName: string
  alignmentStatus: schema.SdgAlignmentStatus | null
  sdgId: number
}

export default async function queryProductAlignmentsFromProductTree(
  companyId: string,
) {
  const resolvedAlignments = await db.execute<Output>(
    sql`
      WITH RECURSIVE
        product_tree AS (
          SELECT
            products.id AS product_id,
            products.name AS product_name,
            products.parent_product_id,
            product_to_sdg_alignments.alignment_status,
            product_to_sdg_alignments.sdg_id,
            products.id AS child_product_id,
            products.name AS child_product_name
          FROM
            products
          LEFT JOIN product_to_sdg_alignments ON products.id = product_to_sdg_alignments.product_id
          WHERE
            products.id IN (
              SELECT
                product_id
              FROM
                company_products
              WHERE
                company_id = ${companyId}
            )
          
          UNION ALL
          
          SELECT
            products.id AS product_id,
            products.name AS product_name,
            products.parent_product_id,
            product_to_sdg_alignments.alignment_status,
            product_to_sdg_alignments.sdg_id,
            product_tree.child_product_id,
            product_tree.child_product_name
          FROM
            products
          LEFT JOIN product_to_sdg_alignments ON products.id = product_to_sdg_alignments.product_id
          INNER JOIN product_tree ON products.id = product_tree.parent_product_id
          WHERE
            product_to_sdg_alignments.sdg_id = product_tree.sdg_id
        )
      
      SELECT
        product_tree.product_id,
        product_tree.product_name,
        product_tree.child_product_id,
        product_tree.child_product_name,
        product_tree.alignment_status,
        product_tree.sdg_id
      FROM
        product_tree
      WHERE
        alignment_status IS NOT NULL;
    `,
  )
  return resolvedAlignments.rows.map(propNamesToCamelCase) as Output[]
}

function propNamesToCamelCase(obj: Record<string, unknown>) {
  return Object.entries(obj).reduce(
    (obj, [key, value]) => Object.assign(obj, { [camelCase(key)]: value }),
    {},
  )
}
