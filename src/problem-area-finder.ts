import { DecoratedDecodedWavType, ProblemAreaType } from './common/type'

export default class ProblemAreaFinder {
  overlap: number
  constructor(overlap: number) {
    this.overlap = overlap
  }

  public determineProblemAreas(
    decoratedDecodedWav: DecoratedDecodedWavType
  ): ProblemAreaType[] {
    return []
  }
}
