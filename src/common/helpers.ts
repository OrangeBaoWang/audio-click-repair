import { bufferSize } from './constants'
import FFTProcessor from './fft'
import { FFTType } from './type'

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

export function getAveragedFfts(fftObj: FFTType): Float32Array[][] {
  const { fftsForAllChannels, overlap } = fftObj
  const halfWidth = overlap / 2
  const fftSize = fftObj.fftsForAllChannels[0][0].length
  const output: Float32Array[][] = []
  fftsForAllChannels.forEach((ffts: Float32Array[], i) => {
    const channelOutput: Float32Array[] = []
    const padding = makeXEmptyArrs(fftSize, halfWidth)
    const fftsWithPadding = [...padding, ...ffts, ...padding]
    const numFfts = ffts.length
    const startIndex = halfWidth
    const endIndex = startIndex + numFfts
    for (let i = startIndex; i < endIndex; i++) {
      const averaged: Float32Array = averageFloat32s(
        fftsWithPadding.slice(i - halfWidth, i + halfWidth)
      )
      channelOutput.push(averaged)
    }
    output.push(channelOutput)
  })

  return output
}

export function averageFloat32s(float32s: Float32Array[]): Float32Array {
  const len = float32s[0].length
  const transposed = transpose(float32s)
  const ret = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    ret[i] = getAverage(transposed[i])
  }
  return ret
}

export function makeXEmptyArrs(
  length: number,
  quantity: number
): Float32Array[] {
  const arr = []
  for (let i = 0; i < quantity; i++) {
    arr.push(new Float32Array(length))
  }
  return arr
}

export function getAverage(arr: number[]): number {
  const total = arr.reduce((total, num) => (total += num))
  return total / arr.length
}

export function transpose(a: Float32Array[]): number[][] {
  return Object.keys(a[0]).map((c: any) => a.map((r: any) => r[c]))
}

export function findTop20(channelData: Float32Array[]): void {
  channelData.forEach((channel: Float32Array, i: number) => {
    const len = channel.length
    const topList = new TopList(10)
    for (let i = 1; i < len; i++) {
      const diff = Math.abs(channel[i] - channel[i - 1])
      if (topList.valueCanEnter(diff)) {
        topList.insert(diff, i)
      }
    }
    topList.print()
  })
}

type TopItem = {
  index: number
  value: number
}

class TopList {
  private list: TopItem[] = []
  private size: number
  constructor(size: number) {
    this.size = size
    for (let i = 0; i < this.size; i++) {
      this.list.push({ value: 0, index: 0 })
    }
  }

  public valueCanEnter(value: number): boolean {
    const lastVal = this.list[this.size - 1].value
    return value > lastVal
  }

  public insert(value: number, index: number): void {
    // find the place... put it in...
    const placeToInsert = this.list.findIndex(item => value > item.value)
    if (placeToInsert > this.size) return // just in case...
    this.list.splice(placeToInsert, 0, { value, index })
    this.list = this.list.slice(0, this.size)
  }

  public print(): void {
    const sampleRate = 44100
    console.log('----------------')
    this.list.forEach(({ value, index }) => {
      console.log(`diff of ${value} at ${index} (time: ${index / sampleRate})`)
    })
  }
}
