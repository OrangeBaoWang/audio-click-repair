import wave
import numpy as np


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


def readWavContents(path):
    return wave.open(path, 'r')
