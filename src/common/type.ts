export interface FFTType {
  fftsForAllChannels: Float32Array[][]
  overlap: number
}

export interface DecodedWavType {
  channelData: Float32Array[]
  length: number
  sampleRate: number
  numberOfChannels: number
}

export interface DecoratedDecodedWavType extends DecodedWavType {
  fftObj: FFTType
}

export interface ProblemAreaType {
  start: number
  end: number
  channel: number
}

export interface PointOfInterestType {
  channel: number
  time: number
}
