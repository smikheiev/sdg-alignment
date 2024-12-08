import { SdgAlignment } from 'api-types'
import calculateTotalAlignmentPerSdg from './calculateSdgAlignment/calculateTotalAlignmentPerSdg'
import querySdgAlignmentDataForCompany from './queryAlignmentData/querySdgAlignmentDataForCompany'

export default async function getSdgAlignment(companyId: string) {
  const data = await querySdgAlignmentDataForCompany(companyId)
  const sdgs = calculateTotalAlignmentPerSdg(data)

  return addMissingSdgs(sdgs)
}

function addMissingSdgs(sdgs: SdgAlignment[]) {
  const allSdgs = new Array(17).fill([])
  return allSdgs.map((_, index) => {
    const existingSdg = sdgs.find((sdg) => sdg.sdgId === index)
    if (!existingSdg) {
      return {
        sdgId: index,
        alignment: null,
      }
    }
    return existingSdg
  })
}
