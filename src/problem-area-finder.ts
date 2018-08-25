import { DecoratedDecodedWavType, ProblemAreaType } from './common/type'
import * as autocorrelation from 'autocorrelation'
import FFTProcessor from './common/fft'
import { fftSize } from './common/constants'
import { getAverage } from './common/helpers'

export default class ProblemAreaFinder {
  overlap: number
  constructor(overlap: number) {
    this.overlap = overlap
  }

  public determineProblemAreas(
    decoratedDecodedWav: DecoratedDecodedWavType
  ): number[][] {
    return decoratedDecodedWav.fftObj.fftsForAllChannels.map((channel, num) => {
      return channel.map(fft => {
        const vals = Array.from(FFTProcessor.fft(fft))
        const avg = getAverage(vals)
        const max = Math.max(...[...vals].slice(5, fftSize))
        return max - avg
      })
    })
  }
}

function getIndexOfMax(arr: number[]): number {
  return arr.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0)
}
