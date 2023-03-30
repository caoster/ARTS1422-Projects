# -*- coding: UTF-8 -*-

import numpy as np
import pandas as pd

class Fire:
    fire_types = []

    def __init__(self, event):
        self.id = event[0]
        self.time = event[1]
        self.lat = event[5]
        self.lng = event[6]

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
        

# file_population_density = np.load("data\\population_density.npy")
# file_regional_industry = np.load("data\\regional_industry.npy")
# file_weather = np.load("data\\weather.npy")
file_fire = pd.read_excel("data\\fire.xlsx")

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
