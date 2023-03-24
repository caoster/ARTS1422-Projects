import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

population_density = np.load("data/population_density.npy")
regional_industry = np.load("data/regional_industry.npy")
weather = np.load("data/weather.npy")
fire = pd.read_excel("data/fire.xlsx")
fire_station = pd.read_excel("data/fire_station.xlsx")

latitude = {}
longitude = {}
for file in [population_density, regional_industry, weather]:
    for j in range(168):
        for i in file[j]:
            if i[0] not in latitude:
                latitude[i[0]] = 1
            else:
                latitude[i[0]] += 1
            if i[1] not in longitude:
                longitude[i[1]] = 1
            else:
                longitude[i[1]] += 1

latitude_keys = np.array(sorted(list(latitude.keys())))
print(latitude_keys)
longitude_keys = np.array(sorted(list(longitude.keys())))
print(longitude_keys)

# difference in list
print(np.diff(latitude_keys))
print(np.diff(longitude_keys))


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
