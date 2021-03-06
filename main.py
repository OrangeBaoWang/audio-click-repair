import sys

if len(sys.argv) != 3:
    sys.exit('''
        You must provide exactly 2 arguments.
            1.) input .wav file path
            2.) output .wav file path    
    ''')

import numpy as np
import scipy.io.wavfile
import detect
import repair
import wavHelpers

input_wav_file_path = sys.argv[1]
output_wav_file_path = sys.argv[2]

wave_file = wavHelpers.readWavContents(input_wav_file_path)
contents = wavHelpers.getWavFileNormalizedToOnes(wave_file)
num_channels = wave_file.getnchannels()
sampling_frequency = wave_file.getframerate()
channels_split = [contents[offset::num_channels]
                  for offset in range(num_channels)]

output = []
for channel in channels_split:
    problem_indices = detect.find_important_indices(
        channel, sampling_frequency)
    for i in problem_indices:
        channel = repair.interpolate_audio(channel, i)
    output.append(channel)

scipy.io.wavfile.write(output_wav_file_path,
                       sampling_frequency, np.array(output).T)
