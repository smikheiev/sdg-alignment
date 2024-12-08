import { migrate } from 'drizzle-orm/postgres-js/migrator'
import db from '../../../db/db'
import * as schema from '../../../db/schema'
import queryProductAlignmentsFromProductTree from './queryProductAlignmentsFromProductTree'

beforeAll(async () => {
  await migrate(db, { migrationsFolder: './dbMigrations' })
})

beforeEach(async () => {
  await db.delete(schema.productToSdgAlignments)
  await db.delete(schema.companyProducts)
  await db.delete(schema.products)
  await db.delete(schema.companies)

  await db.insert(schema.companies).values(company)
  await db
    .insert(schema.products)
    .values([
      agricaltureProduct,
      food,
      fruit,
      apple,
      technology,
      videoStreaming,
    ])
})

it("returns child's product alignment if it has one", async () => {
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

  const result = await queryProductAlignmentsFromProductTree(company.id)

  expect(result).toEqual([
    {
      productId: apple.id,
      productName: apple.name,
      childProductId: apple.id,
      childProductName: apple.name,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
      sdgId: 2,
    },
  ])
})

it("returns parent's product alignment if child does not have it", async () => {
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
      alignmentStatus: null,
    },
    {
      id: 'a1b2c3d4-e5f3-7a8b-9c0d-e1f2a3b4c5d6',
      productId: fruit.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
  ])

  const result = await queryProductAlignmentsFromProductTree(company.id)

  expect(result).toEqual([
    {
      productId: fruit.id,
      productName: fruit.name,
      childProductId: apple.id,
      childProductName: apple.name,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
      sdgId: 2,
    },
  ])
})

it("returns further parent's product alignment if direct parent does not have it", async () => {
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
      alignmentStatus: null,
    },
    {
      id: 'a1b2c3d4-e5f3-7a8b-9c0d-e1f2a3b4c5d6',
      productId: fruit.id,
      sdgId: 2,
      alignmentStatus: null,
    },
    {
      id: '5cf5fcbf-21ad-4207-8680-92b31cecb840',
      productId: food.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
  ])

  const result = await queryProductAlignmentsFromProductTree(company.id)

  expect(result).toEqual([
    {
      productId: food.id,
      productName: food.name,
      childProductId: apple.id,
      childProductName: apple.name,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
      sdgId: 2,
    },
  ])
})

it('returns alignments for multiple products', async () => {
  await db.insert(schema.companyProducts).values([
    {
      id: '0b40bba3-ce70-4280-8fb5-798744fa9b47',
      companyId: company.id,
      productId: apple.id,
      revenuePercentage: 70,
    },
    {
      id: '134a85b5-74c7-4c81-b29b-3550c6a07840',
      companyId: company.id,
      productId: videoStreaming.id,
      revenuePercentage: 30,
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
      id: 'a1b2c3d4-e5f3-7a8b-9c0d-e1f2a3b4c5d6',
      productId: fruit.id,
      sdgId: 2,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
    {
      id: '34cc23c4-d9fd-420c-b9ec-fb6c34c1c15b',
      productId: videoStreaming.id,
      sdgId: 7,
      alignmentStatus: null,
    },
    {
      id: '39c8f275-0d7f-4417-b57a-aee5396482fb',
      productId: technology.id,
      sdgId: 7,
      alignmentStatus: schema.SdgAlignmentStatus.MISALIGNED,
    },
  ])

  const result = await queryProductAlignmentsFromProductTree(company.id)

  expect(result).toEqual([
    {
      productId: fruit.id,
      productName: fruit.name,
      childProductId: apple.id,
      childProductName: apple.name,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
      sdgId: 2,
    },
    {
      productId: technology.id,
      productName: technology.name,
      childProductId: videoStreaming.id,
      childProductName: videoStreaming.name,
      alignmentStatus: schema.SdgAlignmentStatus.MISALIGNED,
      sdgId: 7,
    },
  ])
})

it('returns empty array if alignment was not found in the tree', async () => {
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
      alignmentStatus: null,
    },
    {
      id: 'a1b2c3d4-e5f3-7a8b-9c0d-e1f2a3b4c5d6',
      productId: fruit.id,
      sdgId: 2,
      alignmentStatus: null,
    },
    {
      id: '5cf5fcbf-21ad-4207-8680-92b31cecb840',
      productId: food.id,
      sdgId: 2,
      alignmentStatus: null,
    },
  ])

  const result = await queryProductAlignmentsFromProductTree(company.id)

  expect(result).toEqual([])
})

it('does not return parent alignment for different dsg', async () => {
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
      alignmentStatus: null,
    },
    {
      id: 'a1b2c3d4-e5f3-7a8b-9c0d-e1f2a3b4c5d6',
      productId: fruit.id,
      sdgId: 7,
      alignmentStatus: schema.SdgAlignmentStatus.STRONGLY_ALIGNED,
    },
  ])

  const result = await queryProductAlignmentsFromProductTree(company.id)

  expect(result).toEqual([])
})

// mocks
const company = {
  id: 'c4b62757-b213-459f-9e28-063fc2f0c170',
  name: 'XXX',
}
const agricaltureProduct = {
  id: 'f1d90e8c-5b9f-43e4-893b-8a74c31f7d2e',
  name: 'Agriculture Product',
  parentProductId: null,
}
const food = {
  id: 'b0a0daf0-6695-40c7-a66e-81b94562b5f8',
  name: 'Food',
  parentProductId: agricaltureProduct.id,
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
const videoStreaming = {
  id: '30ec96f2-51fc-4252-9bd7-0e1420213d59',
  name: 'Video Streaming',
  parentProductId: technology.id,
}
