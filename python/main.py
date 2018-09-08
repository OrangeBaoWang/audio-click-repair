import wave
import sys
import numpy as np
import scipy.io.wavfile
import find
import interpolate


import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt

import wave


def normalizeIntArrayToOnes(int_array):
    number_of_bits = 0
    if int_array.dtype == 'int16':
        number_of_bits = 16  # -> 16-bit wav files
    elif int_array.dtype == 'int32':
        number_of_bits = 32  # -> 32-bit wav files
    if number_of_bits == 16 or number_of_bits == 32:
        max_number = float(2 ** (number_of_bits - 1))
        return int_array / (max_number + 1.0)


def getWavFileNormalizedToOnes(wave_file):
    wavFileAsIntArray = np.fromstring(wave_file.readframes(-1), 'Int16')
    return normalizeIntArrayToOnes(wavFileAsIntArray)


wave_file = wave.open(sys.argv[1], 'r')
contents = getWavFileNormalizedToOnes(wave_file)
num_channels = wave_file.getnchannels()
channels_split = [contents[offset::num_channels]
                  for offset in range(num_channels)]

output = []
z = 0
for channel in channels_split:
    print('channel-----------', z)
    z += 1
    problem_indices = find.find_important_indices(channel)
    for i in problem_indices:
        channel = interpolate.interpolate_audio(channel, i)
    output.append(channel)

print(output)
print(type(output))
scipy.io.wavfile.write('test.wav', 44100, np.array(output).T)
