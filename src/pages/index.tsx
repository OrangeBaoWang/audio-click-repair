import * as React from 'react'
import * as Dropzone from 'react-dropzone'
import * as WavDecoder from 'wav-decoder'
import {
  DecodedWavType,
  DecoratedDecodedWavType,
  ProblemAreaType
} from '../common/type'
import Spectrogram from '../spectrogram'
import { overlap } from '../common/constants'
import { getFFTsForAllChannels } from '../common/helpers'
import ProblemAreaFinder from '../problem-area-finder'

interface IndexState {
  decoratedDecodedWav: DecoratedDecodedWavType | null
  problemAreas: ProblemAreaType[] | null
}

export default class extends React.Component<any, IndexState> {
  constructor(props: any) {
    super(props)
    this.state = {
      decoratedDecodedWav: null,
      problemAreas: null
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

        const problemAreaFinder = new ProblemAreaFinder(overlap)
        const problemAreas = problemAreaFinder.determineProblemAreas(
          decoratedDecodedWav
        )

        this.setState({ decoratedDecodedWav, problemAreas })
      })
    }
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.readAsArrayBuffer(file)
  }

  private renderSpectrogram(): JSX.Element | null {
    const { decoratedDecodedWav, problemAreas } = this.state
    return decoratedDecodedWav && problemAreas ? (
      <Spectrogram
        decoratedDecodedWav={decoratedDecodedWav}
        problemAreas={problemAreas}
      />
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
