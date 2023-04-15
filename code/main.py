import pandas as pd
from flask import Flask
import json
from flask import render_template
from markupsafe import Markup

app = Flask(__name__)

grid_json_data = json.load(open("data/geojson.json", "r"))  # This will automatically close the file
fire = pd.read_excel("../data/fire.xlsx")
fire_json_data = {}
for idx, event in fire.iterrows():
    if event[0] not in fire_json_data:
        fire_json_data[event[0]] = {"time": event[1].isoformat(),
                                    "type": event[2],
                                    "fighters": [event[3]],
                                    "lnglat": [event[6], event[5]]}
    else:
        if event[4] == "增援":
            fire_json_data[event[0]]["fighters"].append(event[3])
        else:
            fire_json_data[event[0]]["fighters"].insert(0, event[3])
    if event[4] == "主战":
        fire_json_data[event[0]]["key_fighter"] = event[3]


fire_station = pd.read_excel("../data/fire_station.xlsx")
fire_station['投用年月'] = fire_station['投用年月'].astype(str)
fire_station = dict(zip(fire_station['station_code'], fire_station.set_index('station_code').values.tolist()))


@app.route("/data/fire_station.json")
def fire_station_json():
    return fire_station


@app.route("/data/geojson.json")
def geojson():
    return grid_json_data


@app.route("/data/fire.json")
def fire_json():
    return fire_json_data


@app.route("/")
def webpage():
    return render_template("main.html")


@app.route("/amap")
def amap():
    return render_template("amap.html")


if __name__ == "__main__":
    app.run(port=5000, debug=True, host="0.0.0.0")
