import { SdgAlignmentStatus } from '../../../db/schema'

export function alignmentToScore(alignment: SdgAlignmentStatus | null) {
  switch (alignment) {
    case 'strongly_misaligned':
      return -10
    case 'misaligned':
      return -5
    case 'aligned':
      return 5
    case 'strongly_aligned':
      return 10
    default:
      return 0
  }
}

export function scoreToAlignment(score: number): SdgAlignmentStatus {
  if (score <= -5) {
    return SdgAlignmentStatus.STRONGLY_MISALIGNED
  }
  if (score <= 0) {
    return SdgAlignmentStatus.MISALIGNED
  }
  if (score <= 5) {
    return SdgAlignmentStatus.ALIGNED
  }
  return SdgAlignmentStatus.STRONGLY_ALIGNED
}
