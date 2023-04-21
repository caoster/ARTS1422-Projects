function radius_fire(level) {
    switch (level) {
        case 1:
            return 150;
        case 2:
            return 300;
        case 3:
            return 450;
        case 4:
            return 600;
        default:
            return 150;
    }
}

function radius_fire_station(level) {
    if (level === 1) return 250;
    return 500;
}

function opacity_population(data) {
    // max: 17573.560
    // min: 0.103
    if (data < 1169) return 0.1;
    if (data < 1447) return 0.2;
    if (data < 1976) return 0.3;
    if (data < 3418) return 0.5;
    return 0.7;
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
    else if (count < 6376) b = 0.5;
    else b = 0.7;

    // return 2 * a * b / (a + b);
    return b
}
