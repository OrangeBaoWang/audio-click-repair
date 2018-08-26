import wave
import sys
import numpy as np
import scipy.io.wavfile

from scipy import signal, io
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt


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


def butter_highpass(cutoff, fs, order=5):
    nyq = 0.5 * fs
    normal_cutoff = cutoff / nyq
    b, a = signal.butter(order, normal_cutoff, btype='high', analog=False)
    return b, a


def butter_highpass_filter(data, cutoff, fs, order=5):
    b, a = butter_highpass(cutoff, fs, order=order)
    y = signal.filtfilt(b, a, data)
    return y


wave_file = wave.open(sys.argv[1], 'r')

contents = getWavFileNormalizedToOnes(wave_file)

num_frames = wave_file.getnframes()
num_channels = wave_file.getnchannels()
print('num_frames', num_frames)

channels_split = [contents[offset::num_channels]
                  for offset in range(num_channels)]

filtered_sine = butter_highpass_filter(channels_split[0], 8000, 44100)

x = filtered_sine


# plt.specgram(x, NFFT=1024, Fs=44100, noverlap=900)
# plt.show()


scipy.io.wavfile.write('test.wav', 44100, x)
