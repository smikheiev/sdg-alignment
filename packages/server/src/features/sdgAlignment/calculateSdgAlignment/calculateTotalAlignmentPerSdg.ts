import { pipe } from 'ramda'
import { SdgAlignmentStatus } from '../../../db/schema'
import { alignmentToScore, scoreToAlignment } from './alignmentScoreMapping'

type Input = {
  alignmentStatus: SdgAlignmentStatus | null
  revenuePercentage: number
  sdgId: number
}

export default function calculateTotalAlignmentPerSdg(inputs: Input[]) {
  return pipe(
    addAlignmentScore,
    calculateAlignmentScoreForRevenueShare,
    groupBySdg,
    calculateTotalAlignment,
  )(inputs)
}

type InputWithAlignmentScore = Input & { alignmentScore: number }
function addAlignmentScore(inputs: Input[]) {
  return inputs.map((input) => ({
    ...input,
    alignmentScore: alignmentToScore(input.alignmentStatus),
  }))
}

type InputWithAlignmentScoreForRevenueShare = InputWithAlignmentScore & {
  alignmentScoreForRevenueShare: number
}
function calculateAlignmentScoreForRevenueShare(
  inputs: InputWithAlignmentScore[],
) {
  return inputs.map((input) => ({
    ...input,
    alignmentScoreForRevenueShare:
      (input.alignmentScore * input.revenuePercentage) / 100,
  }))
}

function groupBySdg(inputs: InputWithAlignmentScoreForRevenueShare[]) {
  return inputs.reduce((acc, input) => {
    const group = acc.get(input.sdgId) ?? []
    group.push(input)
    acc.set(input.sdgId, group)

    return acc
  }, new Map<number, InputWithAlignmentScoreForRevenueShare[]>())
}

function calculateTotalAlignment(
  inputsBySdg: Map<number, InputWithAlignmentScoreForRevenueShare[]>,
) {
  return [...inputsBySdg].map(([sdgId, inputs]) => {
    const totalAlignmentScoreForSdg = inputs.reduce(
      (sum, input) => sum + input.alignmentScoreForRevenueShare,
      0,
    )
    const totalAlignmentStatusForSdg = scoreToAlignment(
      totalAlignmentScoreForSdg,
    )
    return {
      sdgId,
      alignment: {
        score: totalAlignmentScoreForSdg,
        status: totalAlignmentStatusForSdg,
      },
    }
  })
}
