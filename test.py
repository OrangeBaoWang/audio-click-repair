import repair

# should be [1, 2, 3, 4, 5]
print(repair.cross_fade_average([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]))

# should be [1.5, 2.0, 1.5]
print(repair.cross_fade_average([1, 2, 3], [3, 2, 1]))

# should be [0.75, 1.0, 0.75]
print(repair.reform([1, 2, 3]))

# should be [1.2, 2.0, 1.8, 3.8]
print(repair.cross_fade_average([1, 2, 3, 3], [2, 2, 1, 4]))
