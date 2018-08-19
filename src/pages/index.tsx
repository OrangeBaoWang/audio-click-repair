import * as React from 'react'
import * as Dropzone from 'react-dropzone'
import * as WavDecoder from 'wav-decoder'
import { DecodedWavType, DecoratedDecodedWavType } from '../common/type'
import Spectrogram from '../spectrogram'
import FFTProcessor from '../common/fft'
import { bufferSize, overlap } from '../common/constants'
import { getFFTsForAllChannels } from '../common/helpers'

interface IndexState {
  decoratedDecodedWav: DecoratedDecodedWavType | null
}

export default class extends React.Component<any, IndexState> {
  constructor(props: any) {
    super(props)
    this.state = {
      decoratedDecodedWav: null
    }
  }

  private handleOnDrop(acceptedFiles: any[], rejectedFiles: any[]): void {
    if (typeof rejectedFiles === 'object' && rejectedFiles.length !== 0) {
      console.log('file rejected')
      return
    }
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => {
      WavDecoder.decode(reader.result).then((data: DecodedWavType) => {
        if (data.numberOfChannels > 2) {
          throw 'Does not support more than 2 channels'
        }

        const fftsForAllChannels: Float32Array[][] = getFFTsForAllChannels(
          data.channelData,
          overlap
        )

        const decoratedDecodedWav = {
          ...data,
          fftObj: {
            fftsForAllChannels,
            overlap
          }
        }
        this.setState({ decoratedDecodedWav })
      })
    }
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsArrayBuffer(file)
  }

  private renderSpectrogram(): JSX.Element | null {
    const { decoratedDecodedWav } = this.state
    return decoratedDecodedWav ? (
      <Spectrogram decoratedDecodedWav={decoratedDecodedWav} />
    ) : null
  }

  public render() {
    return (
      <div>
        <Dropzone multiple={false} onDrop={this.handleOnDrop.bind(this)} />
        {this.renderSpectrogram()}
      </div>
    )
  }
}
