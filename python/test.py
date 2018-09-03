import statsmodels
from statsmodels.tsa.vector_ar.dynamic import DynamicVAR
from statsmodels.tsa.arima_model import ARIMA
import pandas as pd
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import numpy as np


# make a signal
sampling_rate = 44100
frequency = 20
sample = 8000
x = np.arange(sample)
y = np.sin(2 * np.pi * frequency * x / sampling_rate)

# ruin it a bit
y[3996:4004] = [-0.49, -0.48, -0.5, -0.6, -0.65, -0.66, -0.67, -0.677]

plt.plot(x, y)
plt.xlabel('x')
plt.ylabel('y')
plt.show()


# data = [1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1]
# df = pd.DataFrame({'col': data})

# model = ARIMA(df, order=(1, 0, 0))
# results = model.fit(disp=-1)
# model = sm.tsa.ARIMA(df['Price'].iloc[1:], order=(1, 0, 0))

# print('data length', len(data))
# print(results.forecast(5))
# results = DynamicVAR(df)
# print("forcast", results.forecast())
