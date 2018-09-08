import pandas as pd
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import numpy as np
import interpolate


# make a signal
sampling_rate = 44100
frequency = 600
sample = 8000
x = np.arange(sample)
y = np.sin(2 * np.pi * frequency * x / sampling_rate)

# ruin it a bit
y[3996:4004] = [-0.49, -0.48, -0.5, -0.6, -0.65, -0.66, -0.67, -0.677]

# fix
y = interpolate.interpolate_audio(y, 4000)
