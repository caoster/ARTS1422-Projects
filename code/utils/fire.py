import json
import pandas as pd

fire = pd.read_excel("../../data/fire.xlsx")

"""
fire_code
接警时间
警情类型
station_code
参战形式
火灾地址_lat
火灾地址_lng
"""

all_types = {
    "其他": [],
    "居住场所": [],
    "垃圾堆": [],
    "轿车": [],
    "商业场所": [],
    "纯餐饮场所": [],
    "学校": [],
    "工地": [],
    "厂房": [],
    "办公场所": [],
    "货车": [],
    "物资仓储场所": [],
    "露天堆垛": [],
    "公园": [],
    "宾馆、饭店、招待所": [],
    "汽车库": [],
    "室外独立生产设施设备": [],
    "道路绿化带、隔离带": [],
    "交通枢纽（站）": [],
    "电动助力车（三轮车、自行车）": [],
    "客车": [],
    "垃圾箱": [],
    "露天农副业场所": [],
    "公共娱乐场所": [],
    "室外集贸市场": [],
    "医疗机构": [],
    "通信场所": [],
    "石油化工企业": [],
    "宗教场所": [],
    "特种车": [],
    "科研试验场所": []
}
for event in fire.values:
    if event[2] not in all_types:
        all_types["其他"].append({'lat': event[5], 'lon': event[6]})
    else:
        all_types[event[2]].append({'lat': event[5], 'lon': event[6]})

print(all_types)

"""
居住场所 6289
其他 2043
垃圾堆 1766
轿车 1098
商业场所 554
纯餐饮场所 546
学校 484
工地 396
厂房 360
办公场所 334
货车 328
物资仓储场所 262
露天堆垛 244
公园 197
宾馆、饭店、招待所 141
汽车库 85
室外独立生产设施设备 81
道路绿化带、隔离带 75
交通枢纽（站） 71
电动助力车（三轮车、自行车） 68
客车 66
垃圾箱 61
露天农副业场所 57
公共娱乐场所 47
室外集贸市场 36
医疗机构 34
通信场所 30
石油化工企业 18
宗教场所 16
特种车 14
科研试验场所 10
修车库 8
体育场馆 5
加油加气站充电站 4
船舶 4
城市轨道交通工具 4
室内农副业场所 4
会议、展览中心 3
金融交易场所 2
文物古建筑 2
文博馆（图书馆、博物馆、档案馆等） 1
垃圾场 1
摩托车 1
废品回收场所 1
森林 1
养老院 1
"""

with open("../data/fire.json", "w") as outfile:
    json.dump(all_types, outfile)
