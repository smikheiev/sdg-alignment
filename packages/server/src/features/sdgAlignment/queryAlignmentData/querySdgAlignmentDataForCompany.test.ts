import { migrate } from 'drizzle-orm/postgres-js/migrator'
import db from '../../../db/db'
import * as schema from '../../../db/schema'
import querySdgAlignmentDataForCompany from './querySdgAlignmentDataForCompany'

beforeAll(async () => {
  await migrate(db, { migrationsFolder: './dbMigrations' })
})

beforeEach(async () => {
  await db.delete(schema.productToSdgAlignments)
  await db.delete(schema.companyProducts)
  await db.delete(schema.products)
  await db.delete(schema.companies)

  await db.insert(schema.companies).values(company)
  await db.insert(schema.products).values([food, fruit, apple, technology])
})

it('returns alignment data for company', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '0b40bba3-ce70-4280-8fb5-798744fa9b47',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 100,
    },
  ])
  await db.insert(schema.productToSdgAlignments).values([
    {
      id: '8fe1d141-e06b-4e7f-bf92-019f5114f133',
      productId: apple.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
  ])

  const result = await querySdgAlignmentDataForCompany(company.id)

  expect(result).toEqual([
    {
      alignmentStatus: 'strongly_aligned',
      productId: apple.id,
      revenuePercentage: 100,
      sdgId: 2,
    },
  ])
})

it('returns multiple products for the same sdg', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '0b40bba3-ce70-4280-8fb5-798744fa9b47',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 30,
    },
    {
      id: '12345678-1234-1234-1234-123456789012',
      companyId: company.id,
      productId: technology.id,
      revenuePercentage: 70,
    },
  ])
  await db.insert(schema.productToSdgAlignments).values([
    {
      id: '8fe1d141-e06b-4e7f-bf92-019f5114f133',
      productId: apple.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
    {
      id: '3f29a1b2-4c5d-4e6f-8a7b-9c8d0e1f2a3b',
      productId: technology.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_MISALIGNED,
    },
  ])

  const result = await querySdgAlignmentDataForCompany(company.id)

  expect(result).toEqual([
    {
      alignmentStatus: 'strongly_aligned',
      productId: apple.id,
      revenuePercentage: 30,
      sdgId: 2,
    },
    {
      alignmentStatus: 'strongly_misaligned',
      productId: technology.id,
      revenuePercentage: 70,
      sdgId: 2,
    },
  ])
})

it('returns multiple sdgs for the same product', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '0b40bba3-ce70-4280-8fb5-798744fa9b47',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 30,
    },
  ])
  await db.insert(schema.productToSdgAlignments).values([
    {
      id: '8fe1d141-e06b-4e7f-bf92-019f5114f133',
      productId: apple.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
    {
      id: '3f29a1b2-4c5d-4e6f-8a7b-9c8d0e1f2a3b',
      productId: apple.id,
      sdgId: 9,
      alignmentStatus: schema.SdgAlignmentStatus.MISALIGNED,
    },
  ])

  const result = await querySdgAlignmentDataForCompany(company.id)

  expect(result).toEqual([
    {
      alignmentStatus: 'strongly_aligned',
      productId: apple.id,
      revenuePercentage: 30,
      sdgId: 2,
    },
    {
      alignmentStatus: 'misaligned',
      productId: apple.id,
      revenuePercentage: 30,
      sdgId: 9,
    },
  ])
})

it('returns parent product alignment if product does not have alignment', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '12345678-1234-1234-1234-123456789012',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 30,
    },
  ])
  await db.insert(schema.productToSdgAlignments).values([
    {
      id: '5c7828b5-0843-4106-b382-77e57531be61',
      productId: apple.id,
      sdgId: 2,
      alignmentStatus: null,
    },
    {
      id: '8fe1d141-e06b-4e7f-bf92-019f5114f133',
      productId: fruit.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
  ])

  const result = await querySdgAlignmentDataForCompany(company.id)

  expect(result).toEqual([
    {
      alignmentStatus: 'strongly_aligned',
      productId: apple.id,
      revenuePercentage: 30,
      sdgId: 2,
    },
  ])
})

it('returns parent product alignment recursively if product does not have alignment', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '63a0ef96-2ae2-453e-a5f6-3905a6468824',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 30,
    },
  ])
  await db.insert(schema.productToSdgAlignments).values([
    {
      id: '5c7828b5-0843-4106-b382-77e57531be61',
      productId: apple.id,
      sdgId: 2,
      alignmentStatus: null,
    },
    {
      id: '63aec2dc-9461-4983-9a59-197e04c04aa5',
      productId: fruit.id,
      sdgId: 2,
      alignmentStatus: null,
    },
    {
      id: '8fe1d141-e06b-4e7f-bf92-019f5114f133',
      productId: food.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.ALIGNED,
    },
  ])

  const result = await querySdgAlignmentDataForCompany(company.id)

  expect(result).toEqual([
    {
      alignmentStatus: 'aligned',
      productId: apple.id,
      revenuePercentage: 30,
      sdgId: 2,
    },
  ])
})

it('does not return parent product alignment if product has alignment', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '63a0ef96-2ae2-453e-a5f6-3905a6468824',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 30,
    },
  ])
  await db.insert(schema.productToSdgAlignments).values([
    {
      id: '5c7828b5-0843-4106-b382-77e57531be61',
      productId: apple.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
    {
      id: '63aec2dc-9461-4983-9a59-197e04c04aa5',
      productId: fruit.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.ALIGNED,
    },
  ])

  const result = await querySdgAlignmentDataForCompany(company.id)

  expect(result).toEqual([
    {
      alignmentStatus: 'strongly_aligned',
      productId: apple.id,
      revenuePercentage: 30,
      sdgId: 2,
    },
  ])
})

it('filters out if product or parent product has no alignment', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '0b40bba3-ce70-4280-8fb5-798744fa9b47',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 30,
    },
    {
      id: '4e386509-dbd5-464f-bfdb-b7fe4f36bb47',
      companyId: company.id,
      productId: technology.id,
      revenuePercentage: 70,
    },
  ])
  await db.insert(schema.productToSdgAlignments).values([
    {
      id: '8fe1d141-e06b-4e7f-bf92-019f5114f133',
      productId: apple.id,
      sdgId: 2,
      alignmentStatus: null,
    },
    {
      id: '8239115d-4ba0-4e12-a58c-c1cbb05daf54',
      productId: technology.id,
      sdgId: 8,
      alignmentStatus: schema.SdgAlignmentStatus.MISALIGNED,
    },
  ])

  const result = await querySdgAlignmentDataForCompany(company.id)

  expect(result).toEqual([
    {
      alignmentStatus: 'misaligned',
      productId: technology.id,
      revenuePercentage: 70,
      sdgId: 8,
    },
  ])
})

it('returns empty array if company does not have products', async () => {
  const result = await querySdgAlignmentDataForCompany(
    '12345678-1234-1234-1234-123456789012',
  )

  expect(result).toEqual([])
})

// mocks
const company = {
  id: 'c4b62757-b213-459f-9e28-063fc2f0c170',
  name: 'XXX',
}
const food = {
  id: 'b0a0daf0-6695-40c7-a66e-81b94562b5f8',
  name: 'Food',
  parentProductId: null,
}
const fruit = {
  id: '886b0afb-0a31-437d-9e46-f3fb2a37cd15',
  name: 'Fruit',
  parentProductId: food.id,
}
const apple = {
  id: '30ec96f2-51fc-4252-9bd7-0e1420213d56',
  name: 'Apple',
  parentProductId: fruit.id,
}
const technology = {
  id: '30ec96f2-51fc-4252-9bd7-0e1420213d58',
  name: 'Technology',
  parentProductId: null,
}
