# !! xlrd version=1.2.0 needed
import numpy as np
import pandas as pd

file_population_density = np.load("data\\population_density.npy")
# file_regional_industry = np.load("data\\regional_industry.npy")
# file_weather = np.load("data\\weather.npy")
file_fire = pd.read_excel("data\\fire.xlsx")
grids = {}

def time_to_month(time):
    return (time.year - 2007)*12 + time.month

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
    
    return grids[near_key][near_key2]

class Fire:
    fire_types = []

    def __init__(self, event):
        self.id = event[0]
        self.time = event[1]
        self.lat = event[5]
        self.lng = event[6]
        self.population = None
        try:
            self.grid = get_grid_id(self.lat, self.lng, grids)
            self.population = file_population_density[time_to_month(self.time)][self.grid][2]
        except:
            self.grid = None

        # encode type, avoid Chinese
        if event[2] in Fire.fire_types:
            self.type = Fire.fire_types.index(event[2])
        else:
            self.type = len(Fire.fire_types)
            Fire.fire_types.append(event[2])


        self.main_station = "Not_found"
        self.support_station = ""
        if event[4] == "主战":
            self.main_station = event[3]
        else:
            self.support_station += event[3]
        
        self.population = None
        self.temperature = None
        self.wet = None
    
    def append(self, event):
        if event[4] == "主战":
            self.main_station = event[3]
        else:
            self.support_station += event[3]
    
    def  __str__(self):
        # id, type, main_station, support_station, lat, lng, year, month, day_of_week, hour, waiting to add......
        return str(self.id)+","+str(self.type)+","+self.main_station+","+self.support_station+","+str(self.lat)+","+str(self.lng)+","+\
            str(self.time.year)+","+str(self.time.month)+","+str(self.time.dayofweek)+","+str(self.time.hour)+"\n"
        

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


for i in range(len(Fire.fire_types)):
    print(i, Fire.fire_types[i])

with open("code\\data\\fire.csv", "w") as outfile:
    outfile.write("id, type, main_station, support_station, lat, lng, year, month, day_of_week, hour\n")
    for each_fire in fires.values():
        outfile.write(str(each_fire))
