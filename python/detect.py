from scipy import signal, io


def butter_highpass(cutoff, fs, order=5):
    nyq = 0.5 * fs
    normal_cutoff = cutoff / nyq
    b, a = signal.butter(order, normal_cutoff, btype='high', analog=False)
    return b, a


def butter_highpass_filter(data, cutoff, fs, order=5):
    b, a = butter_highpass(cutoff, fs, order=order)
    y = signal.filtfilt(b, a, data)
    return y


def find_important_indices(x, sampling_frequency):
    filtered_sine = butter_highpass_filter(x, 8000, sampling_frequency)
    important_indices = []
    index_of_last_important_diff = 0
    for i, val in enumerate(filtered_sine):
        if i == 0:
            continue
        diff = val - filtered_sine[i - 1]
        if diff > 0.01 and i - index_of_last_important_diff > 200:
            important_indices.append(i)
            index_of_last_important_diff = i
    return important_indices
