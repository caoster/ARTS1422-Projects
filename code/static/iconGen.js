function fire_station_icon(level) {
    return `<svg width="${fire_station_icon.side_length}" height="${fire_station_icon.side_length}">
                <circle cx="${fire_station_icon.side_length / 2}" cy="${fire_station_icon.side_length / 2}" r=${0.16 * fire_station_icon.side_length} fill="green" opacity="90%"/>
            </svg>`
}

fire_station_icon.side_length = 50;

function fire_icon(level) {
    let start = `<svg width="${fire_icon.side_length}" height="${fire_icon.side_length}">`
    let level1 = `<circle cx="${fire_icon.side_length / 2}" cy="${fire_icon.side_length / 2}" r=${0.16 * fire_icon.side_length} fill="red" opacity="90%"/>`
    let level2 = `<circle cx="${fire_icon.side_length / 2}" cy="${fire_icon.side_length / 2}" r=${0.26 * fire_icon.side_length} fill="red" opacity="65%"/>`
    let level3 = `<circle cx="${fire_icon.side_length / 2}" cy="${fire_icon.side_length / 2}" r=${0.36 * fire_icon.side_length} fill="red" opacity="30%"/>`
    let level4 = `<circle cx="${fire_icon.side_length / 2}" cy="${fire_icon.side_length / 2}" r=${0.50 * fire_icon.side_length} fill="red" opacity="15%"/>`
    let end = `</svg>`

    switch (level) {
        case 1:
            return start + level1 + end;
        case 2:
            return start + level1 + level2 + end;
        case 3:
            return start + level1 + level2 + level3 + end;
        case 4:
            return start + level1 + level2 + level3 + level4 + end;
    }
}

fire_icon.side_length = 25;

function opacity_population(data) {
    // max: 17573.560
    // min: 0.103
    if (data < 1169) return 0.1;
    if (data < 1447) return 0.2;
    if (data < 1976) return 0.3;
    if (data < 3418) return 0.5;
    return 0.7;
}
