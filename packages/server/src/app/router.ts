import express from 'express'
import getCompanies from '../features/companies/getCompanies'

const router = express.Router()

router.get('/companies', async (req, res) => {
  const companies = await getCompanies()
  res.json(companies)
})

export default router
