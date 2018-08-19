import { bufferSize } from './constants'
import FFTProcessor from './fft'

export function getFFTsForAllChannels(
  channelData: Float32Array[],
  overlap: number
): Float32Array[][] {
  const fftsForAllChannels: Float32Array[][] = []
  channelData.forEach(data => {
    let currentIndex = 0
    const ffts: Float32Array[] = []
    while (currentIndex + bufferSize < data.length) {
      const fft = FFTProcessor.fft(
        data.slice(currentIndex, currentIndex + bufferSize)
      )
      ffts.push(fft)
      currentIndex += overlap
    }
    fftsForAllChannels.push(ffts)
  })
  return fftsForAllChannels
}
