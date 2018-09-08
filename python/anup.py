
import statsmodels
import pandas as pd
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import numpy as np

# make a signal
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


wave_file = wave.open('/Users/josephweidinger/Desktop/aFewclicks.wav', 'r')
contents = getWavFileNormalizedToOnes(wave_file)
num_channels = wave_file.getnchannels()
channels_split = [contents[offset::num_channels]
                  for offset in range(num_channels)]

data = channels_split[0][0:2560].tolist()
# channel----------- 0
# -----------bad_starting_sample 2536

# data = [1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2,
#         1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1]

import statsmodels.api as sm

df_data = pd.DataFrame({'col': data})
arima200 = sm.tsa.SARIMAX(df_data, order=(2, 0, 0), enforce_stationarity=False)
model_results = arima200.fit()
pred = model_results.get_prediction(
    start=0, end=2559).predicted_mean.values.tolist()
print('data len', len(data), type(data))
print('pred len', len(pred), type(pred))
everything = data + pred
print('everything len', len(everything))
plt.plot(everything)
plt.show()

# print('forcast', forcast)
# model = ARIMA(df, order=(1, 0, 0))
# results = model.fit(disp=-1)

# print('data length', len(data))
# print(results.forecast(5))
# results = DynamicVAR(df)
# print("forcast", results.forecast())
