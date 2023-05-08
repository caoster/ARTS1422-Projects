import pandas as pd
from flask import Flask
import json
from flask import render_template, Response, request
import requests
import datetime

from utils.cal_level import cal_level
from utils.getMonthly import getMonthly

app = Flask(__name__)

grid_json_data = json.load(open("data/geojson.json", "r"))  # This will automatically close the file
fire = pd.read_excel("../data/fire.xlsx")
fire_station = pd.read_excel("../data/fire_station.xlsx")
fire_value, station_ability = cal_level(fire_station, fire)
monthly = getMonthly(fire, fire_value)
monthly = str(monthly)
temperature = {}
with open("data/weather.csv") as csv:
    csv = csv.readlines()
    for i in csv:
        i = i.strip('\n').split(',')
        if i[0] not in temperature:
            temperature[i[0]] = [i[2]]
        else:
            temperature[i[0]].append(i[2])
population_industry = []
with open("data/population_industry.csv") as csv:
    csv = csv.readlines()
    for i in csv:
        i = i.strip('\n').split(',')
        i = [eval(_) for _ in i]
        population_industry.append(i)
fire_json_data = {}
for idx, event in fire.iterrows():
    if event[0] not in fire_json_data:
        fire_json_data[event[0]] = {"id": event[0],
                                    "time": event[1].isoformat(),
                                    "type": event[2],
                                    "fighters": [event[3]],
                                    "lnglat": [event[6], event[5]],
                                    "level": fire_value[event[0]]
                                    }
    else:
        if event[4] == "增援":
            fire_json_data[event[0]]["fighters"].append(event[3])
        else:
            fire_json_data[event[0]]["fighters"].insert(0, event[3])
    if event[4] == "主战":
        fire_json_data[event[0]]["key_fighter"] = event[3]
for i in fire_json_data:
    year, month = fire_json_data[i]["time"].split('-')[0:2]
    fire_json_data[i]['temp'] = float(temperature[year][int(month) - 1])
    for j in population_industry:
        if j[1] < fire_json_data[i]['lnglat'][0] < j[1] + 0.027 and j[0] < fire_json_data[i]['lnglat'][1] < j[0] + 0.027:
            fire_json_data[i]['popu'] = j[3 * ((int(year) - 2007) * 12 + int(month) - 1) + 2]
            fire_json_data[i]['indu'] = j[3 * ((int(year) - 2007) * 12 + int(month) - 1) + 4]
            break
    if "popu" not in fire_json_data[i]:
        fire_json_data[i]['popu'] = 0
        fire_json_data[i]['indu'] = 0
fire_json_data = str([_ for _ in fire_json_data.values()])

fire_station.rename(columns={'所在行政区域': 'district', '投用年月': 'time'}, inplace=True)
fire_station['time'] = fire_station['time'].astype(str)
fire_station['time'] = fire_station['time'].map(lambda x: datetime.date(year=int(x.split('.')[0]), month=max(int(x.split('.')[1]), 1), day=1).isoformat())
fire_station['level'] = 0
for idx, series in fire_station.iterrows():
    if series["station_code"] in station_ability:
        fire_station.at[idx, 'level'] = station_ability[series["station_code"]]
fire_station_str = str(list(fire_station.T.to_dict().values()))

population_enterprise: str
with open("static/population_enterprise.js", "r") as file:
    population_enterprise = file.read()

with open("token.secret") as token:
    TOKEN = token.read()


def redirect_proxy(site, path):
    arg = request.args.copy()
    arg.add("jscode", TOKEN)
    resp: Response.response
    if request.method == "GET":
        resp = requests.get(f"{site}{path}", params=arg)
    elif request.method == "POST":
        resp = requests.post(f"{site}{path}", params=arg)
    else:
        return Response(status=404)
    excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
    headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]
    response = Response(resp.content, resp.status_code, headers)
    return response


@app.route('/_AMapService/v4/map/<path:path>', methods=["GET", "POST"])
def proxy_map(path):
    return redirect_proxy("https://webapi.amap.com/v4/map/", path)


@app.route("/_AMapService/<path:path>", methods=["GET", "POST"])
def proxy(path):
    return redirect_proxy("https://restapi.amap.com/", path)


@app.route("/data/population_enterprise.js")
def population_enterprise_js():
    return population_enterprise


@app.route("/data/monthly.js")
def monthly_js():
    return "let monthly = " + monthly + ";"


@app.route("/data/fire_station.js")
def fire_station_js():
    return "let fire_station = " + fire_station_str + ";"


@app.route("/data/geojson.json")
def geojson():
    return grid_json_data


@app.route("/data/fire.js")
def fire_js():
    return "let fire = " + fire_json_data + ";"


@app.route("/")
def webpage():
    return render_template("amap.html")


if __name__ == "__main__":
    app.run(port=5000, debug=True, host="0.0.0.0")
