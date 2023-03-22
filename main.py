import numpy as np

population_density = np.load("data/population_density.npy")
regional_industry = np.load("data/regional_industry.npy")
weather = np.load("data/weather.npy")

population_density_header = [
    "Latitude",
    "longitude",
    "population_density"
]

regional_industry_header = [
    "Latitude",
    "longitude",
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
