import pandas as pd
from flask import Flask
import json
from flask import render_template, Response, request
import requests
import datetime
from markupsafe import Markup

app = Flask(__name__)

grid_json_data = json.load(open("data/geojson.json", "r"))  # This will automatically close the file
fire = pd.read_excel("../data/fire.xlsx")
fire_json_data = {}
for idx, event in fire.iterrows():
    if event[0] not in fire_json_data:
        fire_json_data[event[0]] = {"id": event[0],
                                    "time": event[1].isoformat(),
                                    "type": event[2],
                                    "fighters": [event[3]],
                                    "lnglat": [event[6], event[5]],
                                    "level": 1
                                    }
    else:
        if event[4] == "增援":
            fire_json_data[event[0]]["fighters"].append(event[3])
        else:
            fire_json_data[event[0]]["fighters"].insert(0, event[3])
    if event[4] == "主战":
        fire_json_data[event[0]]["key_fighter"] = event[3]
fire_json_data = str([_ for _ in fire_json_data.values()])

fire_station = pd.read_excel("../data/fire_station.xlsx")
fire_station.rename(columns={'所在行政区域': 'district', '投用年月': 'time'}, inplace=True)
fire_station['time'] = fire_station['time'].astype(str)
fire_station['time'] = fire_station['time'].map(lambda x: datetime.date(year=int(x.split('.')[0]), month=max(int(x.split('.')[1]), 1), day=1).isoformat())
fire_station['level'] = 1
fire_station = str(list(fire_station.T.to_dict().values()))

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


@app.route("/data/fire_station.js")
def fire_station_js():
    return "let fire_station = " + fire_station + ";"


@app.route("/data/geojson.json")
def geojson():
    return grid_json_data


@app.route("/data/fire.js")
def fire_js():
    return "let fire = " + fire_json_data + ";"


@app.route("/")
def webpage():
    return render_template("main.html")


@app.route("/amap")
def amap():
    return render_template("amap.html")


if __name__ == "__main__":
    app.run(port=5000, debug=True, host="0.0.0.0")
