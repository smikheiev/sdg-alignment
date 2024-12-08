import { SdgAlignmentStatus } from '../../../db/schema'
import calculateTotalAlignmentPerSdg from './calculateTotalAlignmentPerSdg'

it('calculates for one product', () => {
  const inputRows = [
    {
      alignmentStatus: SdgAlignmentStatus.ALIGNED,
      revenuePercentage: 100,
      sdgId: 2,
    },
  ]

  const result = calculateTotalAlignmentPerSdg(inputRows)

  expect(result).toEqual([
    {
      alignment: {
        score: 5,
        status: 'aligned',
      },
      sdgId: 2,
    },
  ])
})

it('calculates for multiple products with same sdg', () => {
  const inputRows = [
    {
      alignmentStatus: SdgAlignmentStatus.ALIGNED,
      revenuePercentage: 70,
      sdgId: 2,
    },
    {
      alignmentStatus: SdgAlignmentStatus.MISALIGNED,
      revenuePercentage: 30,
      sdgId: 2,
    },
  ]

  const result = calculateTotalAlignmentPerSdg(inputRows)

  expect(result).toEqual([
    {
      alignment: {
        score: 2,
        status: 'aligned',
      },
      sdgId: 2,
    },
  ])
})

it('calculates for multiple products with diffrent sdgs', () => {
  const inputRows = [
    {
      alignmentStatus: SdgAlignmentStatus.ALIGNED,
      revenuePercentage: 70,
      sdgId: 2,
    },
    {
      alignmentStatus: SdgAlignmentStatus.MISALIGNED,
      revenuePercentage: 30,
      sdgId: 5,
    },
  ]

  const result = calculateTotalAlignmentPerSdg(inputRows)

  expect(result).toEqual([
    {
      alignment: {
        score: 3.5,
        status: 'aligned',
      },
      sdgId: 2,
    },
    {
      alignment: {
        score: -1.5,
        status: 'misaligned',
      },
      sdgId: 5,
    },
  ])
})
