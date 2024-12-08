import db from '../db'
import * as schema from '../schema'
import * as seedData from './data'

async function clearDatabase() {
  await db.delete(schema.productToSdgAlignments)
  await db.delete(schema.companyProducts)
  await db.delete(schema.products)
  await db.delete(schema.companies)
}

function insertCompanies() {
  return db.insert(schema.companies).values(seedData.companies)
}

function insertProducts() {
  return db.insert(schema.products).values(seedData.products)
}

function inseertCompanyProducts() {
  return db.insert(schema.companyProducts).values(seedData.companyProducts)
}

function insertProductToSdgAlignments() {
  return db
    .insert(schema.productToSdgAlignments)
    .values(seedData.productToSdgAlignments)
}

async function seed() {
  await clearDatabase()
  await insertCompanies()
  await insertProducts()
  await inseertCompanyProducts()
  await insertProductToSdgAlignments()
}

seed().then(() => {
  process.exit(0)
})
