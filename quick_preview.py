import math

import numpy
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import datetime as dt

population_density = np.load("data/population_density.npy")
regional_industry = np.load("data/regional_industry.npy")

a = regional_industry[167] - regional_industry[0]

pop_min = math.inf
pop_max = -math.inf

cal = {}
for i in population_density:
    for j in i:
        cal[(j[0], j[1])] = False

a = []
for i in population_density:
    for j in i:
        pop_min = min(pop_min, j[2])
        pop_max = max(pop_max, j[2])
        if j[2] > 1000:
            cal[(j[0], j[1])] = True
            a.append(j[2])
print(pop_max, pop_min)
a = np.array(a)
print(f"a.size: {a.size}")
plt.hist(a, bins=1000)
plt.show()
# 17573.560546875 0.1028831228613853


# exit(0)
pop_min = math.inf
pop_max = -math.inf
b = []
for i in regional_industry:
    for j in i:
        pop_min = min(pop_min, j[3])
        pop_max = max(pop_max, j[3])
        if j[3] > 1000:
            cal[(j[0], j[1])] = True
            b.append(j[3])
print(pop_max, pop_min)
b = np.array(b)
print(f"b.size: {b.size}")
# b = b[b > 1000]
# print(b.size)
plt.hist(b, bins=1000)
plt.show()

# numpy brief about a
print(f"percentile: {numpy.percentile(b, [20, 40, 60, 80])}")

print(list(cal.values()).count(False))
print(list(cal.values()).count(True))

# weather = np.load("data/weather.npy")
# fire = pd.read_excel("data/fire.xlsx")
# fire_station = pd.read_excel("data/fire_station.xlsx")
# locations: np.ndarray = weather[0][:, 0:2]
#
# # weather_dict
# final_weather = []
#
# start_year = 2007
# start_month = 1
# for i in weather:
#     i[0][0] = start_year
#     i[0][1] = start_month
#
#     start_month += 1
#     if start_month == 13:
#         start_month = 1
#         start_year += 1
#     final_weather.append(i[0][:14])
# final_weather = np.array(final_weather, dtype='object')
# final_weather[:, 0:2] = final_weather[:, 0:2].astype('int')
# final_weather[:, 2:8] = final_weather[:, 2:8].astype('float')
# final_weather[:, -6:] = final_weather[:, -6:].astype('int')
# np.savetxt("weather.csv", final_weather, delimiter=",", fmt='%d,%d,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%d,%d,%d,%d,%d,%d')

res = []
for i in range(168):
    res.append(population_density[i])
    res[-1] = np.append(res[-1], regional_industry[i][:, 2:], axis=1)

p = {}
for i in res:
    for j in i:
        if cal[j[0], j[1]]:
            if (j[0], j[1]) not in p:
                p[(j[0], j[1])] = [(j[2], j[3], j[4])]
            else:
                p[(j[0], j[1])].append((j[2], j[3], j[4]))

q = []
for i in p:
    q.append([])
    q[-1] += i
    for j in p[i]:
        q[-1] += j
res = np.array(q)
# np.savetxt("population_industry.csv", res, fmt='%.3f,%.3f' + ',%.3f,%.3f,%i' * 168)


population_density_header = [
    "Latitude",
    "longitude",
    "population_density"
]

regional_industry_header = [
    "Latitude",
    "longitude",
    "mean_registered_capital",
    "enterprise_count"
]

weather_header = [
    "Latitude",
    "longitude",
    "Average temperature",
    "Average maximum temperature",
    "Average minimum temperature",
    "Absolute maximum temperature",
    "Absolute minimum temperature",
    "Amount of rainfall",
    "Days of precipitation equal or greater than 1mm",
    "Days of precipitation equal or greater than 0.1mm",
    "Days of snow",
    "Days of storm",
    "Days of fog",
    "Days of ground frost",
    "Reliability rate for high temperature",
    "Reliability rate for low temperature",
    "Reliability rate for precipitation"
]
