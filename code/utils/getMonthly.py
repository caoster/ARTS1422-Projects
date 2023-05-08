def getMonthly(fire, fire_value):
    weather_header = [
        "year",
        "month",
        "avg_temp",
        "Average maximum temperature",  #
        "Average minimum temperature",  #
        "Absolute maximum temperature",  #
        "Absolute minimum temperature",  #
        "amt_rain",
        "Days of precipitation equal or greater than 1mm",  #
        "num_rain",
        "num_snow",
        "num_storm",
        "Days of fog",  #
        "Days of ground frost"  #
    ]

    all_data = []
    with open("./data/weather.csv") as file:
        all_line = file.readlines()
        for i in all_line:
            line = dict(zip(weather_header, i.strip("\n").split(",")))
            line.pop("Days of fog")
            line.pop("Days of ground frost")
            line.pop("Days of precipitation equal or greater than 1mm")
            line.pop("Average maximum temperature")
            line.pop("Average minimum temperature")
            line.pop("Absolute maximum temperature")
            line.pop("Absolute minimum temperature")
            line['year'] = int(line['year'])
            line['month'] = int(line['month'])
            line['avg_temp'] = float(line['avg_temp'])
            line['amt_rain'] = float(line['amt_rain'])
            line['num_rain'] = int(line['num_rain'])
            line['num_snow'] = int(line['num_snow'])
            line['num_storm'] = int(line['num_storm'])
            line['num_fire'] = 0
            line['max_level_fire'] = 0
            all_data.append(line)

    for idx, event in fire.iterrows():
        if event[4] == "主战":
            # This is ugly but actually okay
            for i in all_data:
                if i['year'] == event[1].year and i['month'] == event[1].month:
                    i['num_fire'] += 1
                    i['max_level_fire'] = max(i['max_level_fire'], fire_value[event['fire_code']])
    return all_data
