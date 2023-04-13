import pandas as pd
from flask import Flask
import json
from flask import render_template
from markupsafe import Markup

app = Flask(__name__)

grid_json_data = json.load(open("data/geojson.json", "r"))  # This will automatically close the file
fire_json_data = json.load(open("data/fire_mul.json", "r"))
fire = pd.read_excel("../data/fire.xlsx")


@app.route("/data/geojson.json")
def geojson():
    return grid_json_data


@app.route("/data/fire_mul.json")
def fire_json():
    return fire_json_data


@app.route("/")
def webpage():
    return render_template("main.html")


if __name__ == "__main__":
    app.run(port=5000, debug=True)
