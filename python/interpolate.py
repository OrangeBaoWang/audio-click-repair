import statsmodels
from statsmodels.tsa.vector_ar.dynamic import DynamicVAR
import pandas as pd
import numpy as np

import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt

repair_length = 40
spacing = 100


def interpolate_audio(x, bad_starting_sample):
    repair_start = int(bad_starting_sample - (repair_length / 2))
    repair_end = int(bad_starting_sample + (repair_length / 2))
    start = repair_start - spacing
    end = repair_end + spacing
    plt.plot(x[start:end])  # --------
    buffer = x[start:end]
    repaired_buffer = get_better_buffer(buffer.tolist())
    x[start:end] = repaired_buffer
    plt.plot(x[start:end], linewidth=4.0)  # --------
    plt.show()  # --------
    return x


def get_better_buffer(buffer):
    left_side_prediction = get_predicted(buffer[0:spacing])
    right_side_prediction = get_predicted(buffer[::-1][0:spacing])[::-1]
    merged_predictions = cross_fade_average(
        left_side_prediction, right_side_prediction)
    buffer[spacing:spacing+repair_length] = merged_predictions
    return buffer


def get_predicted(buffer):
    df = pd.DataFrame({'col': buffer})
    forcast = DynamicVAR(df).forecast().values.flatten().tolist()
    return forcast[0:repair_length]


def cross_fade_average(left, right):
    if len(left) != len(right):
        print(len(left), len(right))
        raise Exception('Lengths must be equal.')

    return [x + y for x, y in zip(reform(left), reform(right)[::-1])]


def reform(arr):
    length = len(arr)
    return [x * ((length - i) / length) for i, x in enumerate(arr)]
