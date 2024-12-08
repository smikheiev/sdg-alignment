import {
  AnyPgColumn,
  integer,
  pgEnum,
  pgTable,
  real,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { tsEnumToPgEnum } from './schemaUtils'

export const companies = pgTable('companies', {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
})

export const sdgs = pgTable('sdgs', {
  id: integer().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
})

export const products = pgTable('products', {
  id: uuid().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  parentProductId: uuid().references((): AnyPgColumn => products.id),
})

export const companyProducts = pgTable('company_products', {
  id: uuid().primaryKey(),
  companyId: uuid()
    .references(() => companies.id)
    .notNull(),
  productId: uuid()
    .references(() => products.id)
    .notNull(),
  revenuePercentage: real().notNull(),
})

export enum SdgAlignmentStatus {
  STRONGLY_ALIGNED = 'strongly_aligned',
  ALIGNED = 'aligned',
  MISALIGNED = 'misaligned',
  STRONGLY_MISALIGNED = 'strongly_misaligned',
}

export const sdgAlignmentStatusEnum = pgEnum(
  'sdg_alignment',
  tsEnumToPgEnum(SdgAlignmentStatus),
)

export const productToSdgAlignments = pgTable('product_to_sdg_alignments', {
  id: uuid().primaryKey(),
  productId: uuid()
    .references(() => products.id)
    .notNull(),
  sdgId: integer().references(() => sdgs.id),
  alignmentStatus: sdgAlignmentStatusEnum(),
})
