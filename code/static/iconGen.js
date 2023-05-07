function radius_fire(level) {
    /* Map [0, 100] to [150, 600] */
    return level * 3 + 50;
}

function color_fire(value) {
    let opacity = 0.8;
    if (typeSelected.filterType === "") {
        /* Map [0, 100] to [0.4, 0.7] */
        opacity = value.level / 100 * 0.3 + 0.4;
    } else if (typeSelected(value)) {
        opacity = 0.9;
    } else {
        opacity = 0;
    }
    return `rgba(251, 61, 95, ${opacity})`;
}

function radius_fire_station(level) {
    if (level>=0 && level<20) return 50;
    if (level>=20 && level<40) return 100;
    if (level>=40 && level<60) return 150;
    if (level>=60 && level<80) return 200;
    if (level>=80 && level<=100) return 250;
}

function opacity_population(data) {
    // max: 17573.560
    // min: 0.103
    if (data < 1169) return 0.05;
    if (data < 1447) return 0.1;
    if (data < 1976) return 0.2;
    if (data < 3418) return 0.3;
    return 0.4;
}

function opacity_enterprise(capital, count) {
    // density: 17122.0 0.0
    // capital: 60000.0 0.0
    // let a;
    // if (capital < 1189) a = 0.1;
    // else if (capital < 1427) a = 0.2;
    // else if (capital < 1938) a = 0.3;
    // else if (capital < 3382) a = 0.5;
    // else a = 0.7;

    let b;
    if (count < 1549) b = 0.1;
    else if (count < 2322) b = 0.2;
    else if (count < 3558) b = 0.3;
    else if (count < 6376) b = 0.4;
    else b = 0.5;

    // return 2 * a * b / (a + b);
    return b
}
