import * as React from 'react'
import { DecodedWavType } from './common/type'

export interface SpectrogramProps {
  decodedWav: DecodedWavType
}

export interface SpectrogramState {}

export default class Spectrogram extends React.Component<
  SpectrogramProps,
  SpectrogramState
> {
  refs: any

  constructor(props: SpectrogramProps) {
    super(props)
  }

  public componentDidMount(): void {
    this.updateCanvas()
  }
  private updateCanvas(): void {
    const ctx = this.refs.canvas.getContext('2d')
    ctx.fillRect(0, 0, 100, 100)
  }

  public render() {
    return (
      <div>
        hi<canvas ref="canvas" width={300} height={300} />
      </div>
    )
  }
}
