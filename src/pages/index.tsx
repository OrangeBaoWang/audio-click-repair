import * as React from 'react'
import * as Dropzone from 'react-dropzone'
import * as WavDecoder from 'wav-decoder'
import { DecodedWavType } from '../common/type'
import Spectrogram from '../spectrogram'
import FFTProcessor from '../common/fft'
import { bufferSize } from '../common/constants'

interface IndexState {
  decodedWav: DecodedWavType | null
}

export default class extends React.Component<any, IndexState> {
  constructor(props: any) {
    super(props)
    this.state = {
      decodedWav: null
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
        const overlap = 100

        const fftsForAllChannels: Float32Array[][] = []
        data.channelData.forEach(data => {
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
        const decodedWav = {
          ...data,
          fftObj: {
            fftsForAllChannels,
            overlap
          }
        }
        this.setState({ decodedWav })
      })
    }
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsArrayBuffer(file)
  }

  private renderSpectrogram(): JSX.Element | null {
    const { decodedWav } = this.state
    return decodedWav ? <Spectrogram decodedWav={decodedWav} /> : null
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
