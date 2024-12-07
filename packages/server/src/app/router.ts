import express, { Request, Response } from 'express'
import { GetCompaniesResponse } from 'api-types'
import getCompanies from '../features/companies/getCompanies'

const router = express.Router()

router.get(
  '/companies',
  async (req: Request<{}>, res: Response<GetCompaniesResponse>) => {
    const companies = await getCompanies()
    res.json(companies)
  },
)

export default router
