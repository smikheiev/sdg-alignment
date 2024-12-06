import express, { Request, Response } from 'express'
import { GetCompaniesResponse, GetCompanySdgAlignmentResponse } from 'api-types'
import getCompanies from '../features/companies/getCompanies'
import getSdgAlignments from '../features/sdgAlignment/getSdgAlignments'

const router = express.Router()

router.get(
  '/companies',
  async (req: Request<{}>, res: Response<GetCompaniesResponse>) => {
    const companies = await getCompanies()
    res.json(companies)
  },
)

router.get(
  '/company/:companyId/sdg-alignments',
  async (
    req: Request<{ companyId: string }>,
    res: Response<GetCompanySdgAlignmentResponse>,
  ) => {
    const companyId = req.params.companyId
    const sdgAlignments = await getSdgAlignments(companyId)
    res.json(sdgAlignments)
  },
)

export default router
