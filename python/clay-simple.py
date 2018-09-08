import pandas as pd
import statsmodels.api as sm
import numpy as np
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt

# make a signal
sampling_rate = 44100
frequency = 300
sample = 500
x = np.arange(sample)
y = np.sin(2 * np.pi * frequency * x / sampling_rate)

# predict
y_as_dataframe = pd.DataFrame({'col': y})
arima = sm.tsa.SARIMAX(y_as_dataframe, order=(
    2, 0, 0), enforce_stationarity=False)
model_results = arima.fit()
prediction = model_results.get_prediction(
    start=500, end=510).predicted_mean.values.tolist()

print(len(y), type(y))
print(len(prediction), type(prediction))
# merge and plot
final = y.tolist() + prediction
print(len(final))
plt.plot(final)
plt.show()
