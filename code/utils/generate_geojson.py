import json
import numpy as np
import math

population_density = np.load("../../data/population_density.npy")
regional_industry = np.load("../../data/regional_industry.npy")
weather = np.load("../../data/weather.npy")

min_density = math.inf
max_density = -math.inf
population_density_dict_by_month = []
for each_month_population in population_density:
    population_density_dict_by_month.append({})
    for lat, lon, density in each_month_population:
        population_density_dict_by_month[-1][(lon, lat)] = density
        min_density = min(min_density, density)
        max_density = max(max_density, density)

print(f"min_density: {min_density}")
print(f"max_density: {max_density}")

def find_density(month, lon, lat):
    return population_density_dict_by_month[month][(lon, lat)]


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

print(sorted(list(latitude.keys())))
print(sorted(list(longitude.keys())))

geojson = {'type': 'FeatureCollection', 'features': []}

all_pos = []
for file in [population_density, regional_industry, weather]:
    for j in range(168):
        for i in file[j]:  # We want longitude in the front
            all_pos.append((i[1], i[0]))
all_pos = list(set(all_pos))


def add_data_point(position: tuple[float, float]):
    lon, lat = position
    geojson['features'].append({
        'type': 'Feature',
        'properties': {'name': 'A 3x3 Square', 'population_density': {}},
        'geometry': {'type': 'Polygon', 'coordinates': [
            [[lon, lat], [lon + 0.027, lat], [lon + 0.027, lat + 0.027], [lon, lat + 0.027], [lon, lat]]
        ]}
    })
    geojson['features'][-1]['properties']['population_density'] = {month: find_density(month, lon, lat) for month in range(168)}


for i in all_pos:
    add_data_point(i)

# Write to json
with open('../data/geojson.json', 'w') as outfile:
    json.dump(geojson, outfile)
