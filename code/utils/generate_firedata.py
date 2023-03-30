# !! xlrd version=1.2.0 needed
import numpy as np
import pandas as pd
import math
import json

file_population_density = np.load("data/population_density.npy")
# file_regional_industry = np.load("data/regional_industry.npy")
# file_weather = np.load("data/weather.npy")
file_fire = pd.read_excel("data/fire.xlsx")
grids = {}
fire_types = []

def time_to_month(time):
    return (time.year - 2007)*12 + time.month - 1

# UGLY
def get_grid_id(lat,lng,grids):
    near_key = None 
    lats = list(grids.keys())
    lats.sort()
    for i in lats:
        if lat < i:
            near_key = i
            break
    if not near_key or near_key - lat > 0.03:
        raise ValueError
    
    near_key2 = None
    lngs = list(grids[near_key].keys())
    lngs.sort()
    for i in lngs:
        if lng < i:
            near_key2 = i
            break
    if not near_key2 or near_key2 - lng > 0.03:
        raise ValueError
    
    gid = grids[near_key][near_key2]
    return gid

class Fire:
    def __init__(self, event):
        self.id = event[0]
        self.time = event[1]
        self.lat = event[5]
        self.lng = event[6]
        self.population = -1
        try:
            self.grid = get_grid_id(self.lat, self.lng, grids)
            m = time_to_month(self.time)
            self.population = math.log10(file_population_density[time_to_month(self.time)][self.grid][2])
        except:
            self.grid = None

        # encode type, avoid Chinese
        if event[2] in fire_types:
            self.type = fire_types.index(event[2])
        else:
            self.type = len(fire_types)
            fire_types.append(event[2])


        self.main_station = "Not_found"
        self.support_station = ""
        if event[4] == "主战":
            self.main_station = event[3]
        else:
            self.support_station += event[3]
        
        self.temperature = None
        self.wet = None
    
    def append(self, event):
        if event[4] == "主战":
            self.main_station = event[3]
        else:
            self.support_station += event[3]
    
    def js(self):
        # id, type, main_station, support_station, lat, lng, year, month, day_of_week, hour, waiting to add......
        return {"id":self.id, "type":self.type, "day":self.time.dayofyear, "population":self.population, "year":self.time.year}

for i in range(len(file_population_density[0])):
    if file_population_density[0][i][0] in grids.keys():
        grids[file_population_density[0][i][0]][file_population_density[0][i][1]] = i
    else:
        grids[file_population_density[0][i][0]] = {file_population_density[0][i][1]: i}

fires = {}

for event in file_fire.values:
    if event[0] in fires.keys():
        fires[event[0]].append(event)
    else:
        fires[event[0]] = Fire(event)


for i in range(len(fire_types)):
    print(i, fire_types[i])

file = {"type": "FeatureCollection", "features": []}
for i in fires.values():
    if i.population != -1:
        file["features"].append(i.js())

with open("code\\data\\fire_mul.json", "w") as outfile:
    json.dump(file, outfile)
