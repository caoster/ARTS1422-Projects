import json
import numpy as np

population_density = np.load("../../data/population_density.npy")
regional_industry = np.load("../../data/regional_industry.npy")
weather = np.load("../../data/weather.npy")

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
        'properties': {'name': 'A 3x3 Square'},
        'geometry': {'type': 'Polygon', 'coordinates': [
            [[lon, lat], [lon + 0.027, lat], [lon + 0.027, lat + 0.027], [lon, lat + 0.027], [lon, lat]]
        ]}
    })


for i in all_pos:
    add_data_point(i)

# Write to json
with open('../data/geojson.json', 'w') as outfile:
    json.dump(geojson, outfile)
