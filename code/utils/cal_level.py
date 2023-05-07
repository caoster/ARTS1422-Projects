import math

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np


def cal_level(fire_station, fire):
    STATION_STD = 20
    PORTION_ASSIST = 0.33

    final_time = pd.Timestamp(year=2021, month=1, day=1)
    station_time = {}
    for i in fire_station.values:
        tmp_time = pd.Timestamp(year=int(str(i[4]).split('.')[0]), month=max(int(str(i[4]).split('.')[1]), 1), day=1)
        station_time[i[1]] = (final_time - tmp_time).days

    fire_station_name = []
    fire_value = []
    for i in fire.values:
        if i[3] not in fire_station_name:
            fire_station_name.append(i[3])
    station_ability = dict(zip(fire_station_name, [100 for _ in range(len(fire_station_name))]))

    def iter_once(idx):
        nonlocal station_ability, fire_value
        smallest_station = np.min(list(station_ability.values()))
        fire_value = [[0, 0] for _ in range(13733)]
        station_ability_new = dict(zip(fire_station_name, [0 for _ in range(len(fire_station_name))]))
        for j in fire.values:
            if j[4] == "主战":
                fire_value[j[0]][0] += station_ability[j[3]]
            else:
                fire_value[j[0]][1] += station_ability[j[3]]
        for j in range(len(fire_value)):
            if fire_value[j][0] == 0:
                fire_value[j] = smallest_station * PORTION_ASSIST + math.sqrt(fire_value[j][1]) * PORTION_ASSIST * 10
            elif fire_value[j][1] == 0:
                fire_value[j] = fire_value[j][0]
            else:
                fire_value[j] = fire_value[j][0] + math.sqrt(fire_value[j][1]) * PORTION_ASSIST * 10

        for j in fire.values:
            if j[4] == "主战":
                station_ability_new[j[3]] += fire_value[j[0]]
            else:
                station_ability_new[j[3]] += fire_value[j[0]] * PORTION_ASSIST
        for j in station_ability:
            station_ability_new[j] /= math.sqrt(station_time[j])
        # Normalize
        a = np.array(list(station_ability_new.values()))
        a *= STATION_STD / a.std()
        a += 100 - a.mean()
        station_ability_new = dict(zip(fire_station_name, list(a)))
        b = np.array(fire_value[1:])
        # print(f"idx: {idx}, capacity_min: {a.min()}, capacity_max: {a.max()}, fire_min: {b.min()}, fire_max: {b.max()}, fire_mean: {b.mean()}, fire_std: {b.std()}")
        if np.allclose(a, np.array(list(station_ability.values()))):
            return True
        else:
            station_ability = station_ability_new
            return False

    for i in range(1000):
        if iter_once(i):
            break
    fire_value = (fire_value - np.min(fire_value)) / (np.max(fire_value) - np.min(fire_value)) * 100
    a = np.array(list(station_ability.values()))
    a = (a - np.min(a)) / (np.max(a) - np.min(a)) * 100
    station_ability = dict(zip(fire_station_name, list(a)))

    return fire_value, station_ability


if __name__ == "__main__":
    fire = pd.read_excel("../../data/fire.xlsx")
    fire_station = pd.read_excel("../../data/fire_station.xlsx")

    fire_value1, station_ability1 = cal_level()
    plt.hist(fire_value1, bins=50)
    plt.show()
    plt.hist(station_ability1.values(), bins=10)
    plt.show()
