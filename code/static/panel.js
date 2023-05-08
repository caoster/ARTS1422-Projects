function rounded_rect(ctx, left, top, width, height, radius, stroke, fill, lineWidth = 3) {
    let K = 4 * (Math.SQRT2 - 1) / 3; // constant for circles using Bezier curve.
    let right = left + width;
    let bottom = top + height;
    let path = new Path2D();
    ctx.beginPath();
    // top left
    path.moveTo(left + radius, top);
    // top right
    path.lineTo(right - radius, top);
    // right top
    path.bezierCurveTo(right + radius * (K - 1), top, right, top + radius * (1 - K), right, top + radius);
    // right bottom
    path.lineTo(right, bottom - radius);
    // bottom right
    path.bezierCurveTo(right, bottom + radius * (K - 1), right + radius * (K - 1), bottom, right - radius, bottom);
    // bottom left
    path.lineTo(left + radius, bottom);
    // left bottom
    path.bezierCurveTo(left + radius * (1 - K), bottom, left, bottom + radius * (K - 1), left, bottom - radius);
    // left top
    path.lineTo(left, top + radius);
    // top left again
    path.bezierCurveTo(left, top + radius * (1 - K), left + radius * (1 - K), top, left + radius, top);

    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.stroke(path);
    ctx.fill(path);
    return path;
}

function drawLeftPanel() {
    if (drawLeftPanel.settings === undefined) {
        drawLeftPanel.canvas = document.createElement('canvas');
        document.getElementById("left-panel").appendChild(drawLeftPanel.canvas);
        drawLeftPanel.canvas.width = 243;
        drawLeftPanel.canvas.height = 487;
        drawLeftPanel.canvas.id = "left-panel-bg";
        drawLeftPanel.ctx = drawLeftPanel.canvas.getContext('2d');
        drawLeftPanel.settings = {
            "fire": true,
            "fire_station": true,
            "show_area": false,
            "minute": 5,
            "population": false,
            "enterprise": false,
            "select": false
        };
        drawLeftPanel.canvas.addEventListener("click", (event) => {
            if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.fire_button, event.offsetX, event.offsetY)) drawLeftPanel.settings.fire = !drawLeftPanel.settings.fire;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.fire_station_button, event.offsetX, event.offsetY)) drawLeftPanel.settings.fire_station = !drawLeftPanel.settings.fire_station;
            else if (drawLeftPanel.ctx.isPointInPath(display_area, event.offsetX, event.offsetY)) drawLeftPanel.settings.show_area = !drawLeftPanel.settings.show_area;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.scale_5_button, event.offsetX, event.offsetY) && drawLeftPanel.settings.show_area) drawLeftPanel.settings.minute = 5;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.scale_7_button, event.offsetX, event.offsetY) && drawLeftPanel.settings.show_area) drawLeftPanel.settings.minute = 7;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.scale_11_button, event.offsetX, event.offsetY) && drawLeftPanel.settings.show_area) drawLeftPanel.settings.minute = 11;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.population_button, event.offsetX, event.offsetY)) {
                drawLeftPanel.settings.population = !drawLeftPanel.settings.population;
                if (drawLeftPanel.settings.population) drawLeftPanel.settings.enterprise = false;
            } else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.enterprise_button, event.offsetX, event.offsetY)) {
                drawLeftPanel.settings.enterprise = !drawLeftPanel.settings.enterprise;
                if (drawLeftPanel.settings.enterprise) drawLeftPanel.settings.population = false;
            } else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.select_button, event.offsetX, event.offsetY)) drawLeftPanel.settings.select = !drawLeftPanel.settings.select;
            else return;
            redraw();
        });
        redraw();
    }

    function redraw() {
        drawLeftPanel.ctx.clearRect(0, 0, drawLeftPanel.canvas.width, drawLeftPanel.canvas.height);
        drawLeftPanel();
        drawLeftPanel.settings.fire ? fireLayer.show() : fireLayer.hide();
        drawLeftPanel.settings.fire_station ? fireStationLayer.show() : fireStationLayer.hide();
        drawLeftPanel.settings.population ? populationLayer.show() : populationLayer.hide();
        drawLeftPanel.settings.enterprise ? enterpriseLayer.show() : enterpriseLayer.hide();
        display_duration();
        drawLeftPanel.settings.show_area ? durationLayer.show() : durationLayer.hide();
        drawLeftPanel.settings.select ? drawPolygon() : removePolygon();
        drawRightMidLeftPanel();
        drawRightMidRightPanel();
    }

    /* Background */
    rounded_rect(drawLeftPanel.ctx, 3, 3, 237, 481, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');
    if (drawLeftPanel.settings.fire)
        drawLeftPanel.fire_button = rounded_rect(drawLeftPanel.ctx, 17, 16, 209, 50, 20, 'rgba(251, 61, 95, 1)', 'rgba(251, 61, 95, 0.4)');
    else
        drawLeftPanel.fire_button = rounded_rect(drawLeftPanel.ctx, 17, 16, 209, 50, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)');
    rounded_rect(drawLeftPanel.ctx, 17, 96, 209, 145, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');
    if (drawLeftPanel.settings.fire_station)
        drawLeftPanel.fire_station_button = rounded_rect(drawLeftPanel.ctx, 17, 96, 209, 50, 20, 'rgba(27, 169, 101, 1)', 'rgba(27, 169, 101, 0.4)');
    else
        drawLeftPanel.fire_station_button = rounded_rect(drawLeftPanel.ctx, 17, 96, 209, 50, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)');
    drawLeftPanel.ctx.font = "bold 20px IBM Plex Sans Hebrew";
    drawLeftPanel.ctx.fillStyle = "white";
    drawLeftPanel.ctx.textAlign = "center";

    drawImage("static/texture/fire.png", 60, 20, 0.5);
    drawLeftPanel.ctx.fillText("火灾", 134, 48.5);
    drawImage("static/texture/fire_station.png", 50, 100, 0.5);
    drawLeftPanel.ctx.fillText("消防站", 144, 128.5);

    let display_area = rounded_rect(drawLeftPanel.ctx, 27, 156, 189, 40, 20, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');

    if (drawLeftPanel.settings.show_area)
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    else
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    drawLeftPanel.ctx.fillText("显示服务范围", 98, 182);
    let checkmark = new Path2D();
    checkmark.addPath(
        new Path2D("M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597z"),
        {
            e: 175,
            f: 163
        });
    drawLeftPanel.ctx.fill(checkmark);

    if (drawLeftPanel.settings.show_area && drawLeftPanel.settings.minute === 5) {
        drawLeftPanel.scale_5_button = rounded_rect(drawLeftPanel.ctx, 25, 194, 35, 40, 10, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.5)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    } else {
        drawLeftPanel.scale_5_button = rounded_rect(drawLeftPanel.ctx, 25, 194, 35, 40, 10, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    }
    drawLeftPanel.ctx.fillText("5", 44, 220);

    if (drawLeftPanel.settings.show_area && drawLeftPanel.settings.minute === 7) {
        drawLeftPanel.scale_7_button = rounded_rect(drawLeftPanel.ctx, 71, 194, 35, 40, 10, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.5)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    } else {
        drawLeftPanel.scale_7_button = rounded_rect(drawLeftPanel.ctx, 71, 194, 35, 40, 10, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    }
    drawLeftPanel.ctx.fillText("7", 88, 220);

    if (drawLeftPanel.settings.show_area && drawLeftPanel.settings.minute === 11) {
        drawLeftPanel.scale_11_button = rounded_rect(drawLeftPanel.ctx, 115, 194, 35, 40, 10, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.5)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    } else {
        drawLeftPanel.scale_11_button = rounded_rect(drawLeftPanel.ctx, 115, 194, 35, 40, 10, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    }
    drawLeftPanel.ctx.fillText("11", 132, 220);
    if (drawLeftPanel.settings.show_area)
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    else
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    drawLeftPanel.ctx.fillText("min", 182, 220);

    rounded_rect(drawLeftPanel.ctx, 17, 274, 209, 111, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');

    if (drawLeftPanel.settings.population)
        drawLeftPanel.population_button = rounded_rect(drawLeftPanel.ctx, 17, 274, 209, 54, 20, 'rgba(227, 209, 110, 1)', 'rgba(227, 209, 110, 0.4)');
    else
        drawLeftPanel.population_button = rounded_rect(drawLeftPanel.ctx, 17, 274, 209, 54, 20, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)');
    drawImage("static/texture/people.png", 50, 280, 0.5);
    drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    drawLeftPanel.ctx.fillText("人口密度", 140, 309);

    drawLeftPanel.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    drawLeftPanel.ctx.moveTo(17, 328);
    drawLeftPanel.ctx.lineTo(226, 328);
    drawLeftPanel.ctx.stroke();
    if (drawLeftPanel.settings.enterprise)
        drawLeftPanel.enterprise_button = rounded_rect(drawLeftPanel.ctx, 17, 331, 209, 54, 20, 'rgba(184, 155, 221, 1)', 'rgba(184, 155, 221, 0.4)');
    else
        drawLeftPanel.enterprise_button = rounded_rect(drawLeftPanel.ctx, 17, 331, 209, 54, 20, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)');
    drawImage("static/texture/enterprise.png", 50, 337, 0.5);
    drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    drawLeftPanel.ctx.fillText("企业密度", 140, 365);

    if (drawLeftPanel.settings.select)
        drawLeftPanel.select_button = rounded_rect(drawLeftPanel.ctx, 17, 410, 209, 50, 20, 'rgb(31, 88, 180)', 'rgba(31, 88, 180, 0.4)');
    else
        drawLeftPanel.select_button = rounded_rect(drawLeftPanel.ctx, 17, 410, 209, 50, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)');
    drawImage("static/texture/select.png", 65, 420, 0.5);
    drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    drawLeftPanel.ctx.fillText("框选", 134, 443);

    function drawImage(path, x, y, scale) {
        let drawing = new Image();
        drawing.src = path;
        drawing.onload = function () {
            drawLeftPanel.ctx.drawImage(drawing, x, y, drawing.width * scale, drawing.height * scale);
        };
    }
}

function drawRightPanel() {
    drawRightPanel.canvas = document.querySelector("#right-panel");
    drawRightPanel.canvas.width = 600;
    drawRightPanel.canvas.height = 920;
    drawRightPanel.ctx = drawRightPanel.canvas.getContext("2d");

    rounded_rect(drawRightPanel.ctx, 5, 5, 600 - 10, 920 - 10, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.7)');
    drawRightPanel.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    drawRightPanel.ctx.lineWidth = 2;
    drawRightPanel.ctx.moveTo(15, 300 + 20);
    drawRightPanel.ctx.lineTo(600 - 15, 300 + 20);
    drawRightPanel.ctx.stroke();
    drawRightPanel.ctx.moveTo(15, 600 + 20);
    drawRightPanel.ctx.lineTo(600 - 15, 600 + 20);
    drawRightPanel.ctx.stroke();

    drawRightUpPanel();
    drawRightMidLeftPanel();
    drawRightMidRightPanel();
    drawRightBotPanel();
}

function drawRightUpPanel() {
    let mousePosition = {};

    drawRightUpPanel.canvas = document.createElement("canvas");
    drawRightUpPanel.canvas.width = 600 * 2;
    drawRightUpPanel.canvas.height = 300 * 2;
    let ctx = drawRightUpPanel.canvas.getContext("2d");

    let cBox = document.getElementById("right-up-panel");
    cBox.appendChild(drawRightUpPanel.canvas);

    let cMargin = 20;
    let cSpace = 80;

    drawRightUpPanel.canvas.style.height = drawRightUpPanel.canvas.height / 2 + "px";
    drawRightUpPanel.canvas.style.width = drawRightUpPanel.canvas.width / 2 + "px";
    let cHeight = drawRightUpPanel.canvas.height - cMargin * 2 - cSpace * 2;
    let cWidth = drawRightUpPanel.canvas.width - cMargin * 2 - cSpace * 2;
    let originX = cMargin + cSpace;
    let originY = cMargin + cHeight;

    // 柱状图信息
    let totalBars = monthly.length;
    let bWidth = cWidth / totalBars / 3;
    let bMargin = (cWidth - bWidth * totalBars) / (totalBars + 1);
    let totalXNumber = 5;

    drawRightUpPanel.properties = {
        'avg_temp': {'rng_min': Number.POSITIVE_INFINITY, 'rng_max': Number.NEGATIVE_INFINITY, 'color': 'rgba(255, 255, 255, 0.6)', 'show': false, 'clickObj': undefined},
        'amt_rain': {'rng_min': Number.POSITIVE_INFINITY, 'rng_max': Number.NEGATIVE_INFINITY, 'color': 'rgba(26, 166, 244, 1)', 'show': false, 'clickObj': undefined},
        'num_rain': {'rng_min': Number.POSITIVE_INFINITY, 'rng_max': Number.NEGATIVE_INFINITY, 'color': 'rgba(250, 255, 0, 1)', 'show': false, 'clickObj': undefined},
        'num_snow': {'rng_min': Number.POSITIVE_INFINITY, 'rng_max': Number.NEGATIVE_INFINITY, 'color': 'rgba(178, 255, 218, 1)', 'show': false, 'clickObj': undefined},
        'num_storm': {'rng_min': Number.POSITIVE_INFINITY, 'rng_max': Number.NEGATIVE_INFINITY, 'color': 'rgba(119, 98, 251, 1)', 'show': false, 'clickObj': undefined},
        'num_fire': {'rng_min': Number.POSITIVE_INFINITY, 'rng_max': Number.NEGATIVE_INFINITY, 'color': 'rgba(251, 61, 95, 1)', 'show': true, 'clickObj': undefined},
        'max_level_fire': {'rng_min': Number.POSITIVE_INFINITY, 'rng_max': Number.NEGATIVE_INFINITY, 'color': 'rgba(251, 61, 95, 0.5)', 'show': false, 'clickObj': undefined},
    }
    drawRightUpPanel.property_list = [
        'avg_temp',
        'amt_rain',
        'num_rain',
        'num_snow',
        'num_storm',
        'num_fire',
        'max_level_fire'
    ]

    drawRightUpPanel.points = {
        'avg_temp': [],
        'amt_rain': [],
        'num_rain': [],
        'num_snow': [],
        'num_storm': [],
        'num_fire': [],
        'max_level_fire': [],
    }
    loaded();

    function loaded() {
        let prop = drawRightUpPanel.properties;
        for (const monthlyElement of monthly) {
            prop.avg_temp.rng_max = Math.max(prop.avg_temp.rng_max, monthlyElement.avg_temp);
            prop.avg_temp.rng_min = Math.min(prop.avg_temp.rng_min, monthlyElement.avg_temp);

            prop.amt_rain.rng_max = Math.max(prop.amt_rain.rng_max, monthlyElement.amt_rain);
            prop.amt_rain.rng_min = Math.min(prop.amt_rain.rng_min, monthlyElement.amt_rain);

            prop.num_rain.rng_max = Math.max(prop.num_rain.rng_max, monthlyElement.num_rain);
            prop.num_rain.rng_min = Math.min(prop.num_rain.rng_min, monthlyElement.num_rain);

            prop.num_snow.rng_max = Math.max(prop.num_snow.rng_max, monthlyElement.num_snow);
            prop.num_snow.rng_min = Math.min(prop.num_snow.rng_min, monthlyElement.num_snow);

            prop.num_storm.rng_max = Math.max(prop.num_storm.rng_max, monthlyElement.num_storm);
            prop.num_storm.rng_min = Math.min(prop.num_storm.rng_min, monthlyElement.num_storm);

            prop.num_fire.rng_max = Math.max(prop.num_fire.rng_max, monthlyElement.num_fire);
            prop.num_fire.rng_min = Math.min(prop.num_fire.rng_min, monthlyElement.num_fire);

            prop.max_level_fire.rng_max = Math.max(prop.max_level_fire.rng_max, monthlyElement.max_level_fire);
            prop.max_level_fire.rng_min = Math.min(prop.max_level_fire.rng_min, monthlyElement.max_level_fire);
        }
        Object.keys(drawRightUpPanel.properties).forEach(key => {
            let diff = 0.05 * (drawRightUpPanel.properties[key].rng_max - drawRightUpPanel.properties[key].rng_min);
            drawRightUpPanel.properties[key].rng_max += diff;
            drawRightUpPanel.properties[key].rng_min -= diff;
        });

        let points = drawRightUpPanel.points;
        for (let i = 0; i < monthly.length; i++) {
            let x = originX + (bWidth + bMargin) * i + bMargin + bWidth / 2;

            points.avg_temp.push({x: x, y: originY - cHeight * (monthly[i].avg_temp - prop.avg_temp.rng_min) / (prop.avg_temp.rng_max - prop.avg_temp.rng_min)});
            points.amt_rain.push({x: x, y: originY - cHeight * (monthly[i].amt_rain - prop.amt_rain.rng_min) / (prop.amt_rain.rng_max - prop.amt_rain.rng_min)});
            points.num_rain.push({x: x, y: originY - cHeight * (monthly[i].num_rain - prop.num_rain.rng_min) / (prop.num_rain.rng_max - prop.num_rain.rng_min)});
            points.num_snow.push({x: x, y: originY - cHeight * (monthly[i].num_snow - prop.num_snow.rng_min) / (prop.num_snow.rng_max - prop.num_snow.rng_min)});
            points.num_storm.push({x: x, y: originY - cHeight * (monthly[i].num_storm - prop.num_storm.rng_min) / (prop.num_storm.rng_max - prop.num_storm.rng_min)});
            points.num_fire.push({x: x, y: originY - cHeight * (monthly[i].num_fire - prop.num_fire.rng_min) / (prop.num_fire.rng_max - prop.num_fire.rng_min)});
            points.max_level_fire.push({x: x, y: originY - cHeight * (monthly[i].max_level_fire - prop.max_level_fire.rng_min) / (prop.max_level_fire.rng_max - prop.max_level_fire.rng_min)});
        }
        drawBody();
    }

    function drawTime() {
        let radius = 15;
        if (begin.getTime() === end.getTime()) {
            let x = originX + (bWidth + bMargin) * getIdx(begin) + bMargin + bWidth / 2;
            drawLineWithColor(x + bWidth / 2 - 1, cMargin, x + bWidth / 2 - 1, originY, "rgb(255, 255, 255, 0.7)");
            drawRightUpPanel.ctrl1 = drawFilledCircleWithColor(x + bWidth / 2 - 1, cMargin, radius, "rgb(255, 255, 255, 1)");
            drawRightUpPanel.ctrl2 = undefined;
        } else {
            let x1 = originX + (bWidth + bMargin) * getIdx(begin) + bMargin + bWidth / 2;
            let x2 = originX + (bWidth + bMargin) * getIdx(end) + bMargin + bWidth / 2;
            drawRect(x1 + bWidth / 2 - 1, cMargin, x2 - x1, originY - cMargin, "rgb(255, 255, 255, 0.2)");

            drawLineWithColor(x1 + bWidth / 2 - 1, cMargin, x1 + bWidth / 2 - 1, originY, "rgb(255, 255, 255, 0.7)");
            drawRightUpPanel.ctrl1 = drawFilledCircleWithColor(x1 + bWidth / 2 - 1, cMargin, radius, "rgb(255, 255, 255, 1)");

            drawLineWithColor(x2 + bWidth / 2 - 1, cMargin, x2 + bWidth / 2 - 1, originY, "rgb(255, 255, 255, 0.7)");
            drawRightUpPanel.ctrl2 = drawFilledCircleWithColor(x2 + bWidth / 2 - 1, cMargin, radius, "rgb(255, 255, 255, 1)");
        }

        function getIdx(timestamp) {
            for (let i = 0; i < monthly.length; i++) {
                if (timestamp.getFullYear() <= monthly[i].year && timestamp.getMonth() <= monthly[i].month) {
                    return i;
                }
            }
            return monthly.length - 1;
        }
    }

    function drawLineLabelMarkers() {
        ctx.font = "24px Arial";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#000000";
        drawLineWithColor(originX, originY, originX + cWidth, originY, "white");
        drawLineWithColor(originX, cMargin, originX + cWidth, cMargin, "white");
        drawXMarkers();
    }

    function drawLineWithColor(x, y, X, Y, color) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(X, Y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }

    function drawFilledCircleWithColor(x, y, radius, color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        let path = new Path2D();
        path.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill(path);
        return path;
    }


    function drawXMarkers() {
        ctx.strokeStyle = "#E0E0E0";
        ctx.textAlign = "center";
        for (let i = 0; i < totalBars; i++) {
            if (i % parseInt(totalBars / totalXNumber) === 0) {
                let markerVal = monthly[i].year + '-' + monthly[i].month;
                let xMarker = parseInt(originX + cWidth * (i / totalBars) + bMargin + bWidth / 2);
                let yMarker = originY + 30;
                ctx.fillStyle = "white";
                ctx.font = "22px Verdana";
                ctx.fillText(markerVal, xMarker, yMarker, cSpace);
                if (i > 0) {
                    drawLineWithColor(xMarker, originY, xMarker, originY - 10, "white");
                }
            }
        }
    }

    function drawPlot() {
        for (const propertyListKey of drawRightUpPanel.property_list) {
            let color = drawRightUpPanel.properties[propertyListKey].color;
            if (!drawRightUpPanel.properties[propertyListKey].show) color = color.replace(/[^,]+(?=\))/, " 0");
            drawBezier(drawRightUpPanel.points[propertyListKey], color);
        }
    }

    function drawChoice() {
        ctx.fillStyle = "white";
        ctx.font = "26px Verdana";

        let idx = 0;
        let position = [[40, 238], [150, 238], [260, 238], [370, 238], [480, 238], [40, 268], [150, 268]];
        let translate = ['平均气温', '平均降雨', '霜降天数', '降雪天数', '暴雨天数', '火灾数量', '最大火灾'];
        for (const propertyListKey of drawRightUpPanel.property_list) {
            let color = drawRightUpPanel.properties[propertyListKey].color;
            if (!drawRightUpPanel.properties[propertyListKey].show) color = color.replace(/[^,]+(?=\))/, " 0.1");
            drawRightUpPanel.properties[propertyListKey].clickObj = drawRoundedRect(position[idx][0], position[idx][1], 80, 25, 10, color, "black");
            ctx.fillStyle = "white";
            ctx.fillText(translate[idx], (position[idx][0] + 40) * 2, (position[idx][1] + 15) * 2);
            ++idx;
        }
    }

    function drawRoundedRect(left, top, width, height, radius, stroke, fill) {
        left *= 2;
        top *= 2;
        width *= 2;
        height *= 2;
        radius *= 2;
        return rounded_rect(ctx, left, top, width, height, radius, stroke, fill, 10);
    }

    function drawBezier(point, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.font = "20px SimSun";
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < point.length; i++) {
            if (i === 0) {
                ctx.moveTo(point[i].x, point[i].y);
            } else {
                let ctrlP = getCtrlPoint(point, i - 1);
                ctx.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, point[i].x, point[i].y);
                // ctx.fillText("("+point[i].x+","+point[i].y+")",point[i].x,point[i].y);
            }
        }
        ctx.stroke();
    }

    function getCtrlPoint(ps, i) {
        let a = 0.25;
        let b = 0.25;

        let pAx, pAy, pBx, pBy;

        if (i < 1) {
            pAx = ps[0].x + (ps[1].x - ps[0].x) * a;
            pAy = ps[0].y + (ps[1].y - ps[0].y) * a;
        } else {
            pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * a;
            pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * a;
        }
        if (i > ps.length - 3) {
            let last = ps.length - 1
            pBx = ps[last].x - (ps[last].x - ps[last - 1].x) * b;
            pBy = ps[last].y - (ps[last].y - ps[last - 1].y) * b;
        } else {
            pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
            pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
        }

        return {
            pA: {x: pAx, y: pAy},
            pB: {x: pBx, y: pBy}
        }
    }

    function drawRect(x, y, X, Y, color) {

        ctx.beginPath();
        ctx.rect(parseInt(x), parseInt(y), parseInt(X), parseInt(Y));

        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

    }

    addMouseMove();

    function drawBody() {
        ctx.clearRect(0, 0, drawRightUpPanel.canvas.width, drawRightUpPanel.canvas.height);
        drawLineLabelMarkers();
        drawPlot();
        drawChoice();
        drawTime();
    }

    function addMouseMove() {
        drawRightUpPanel.canvas.addEventListener("mousemove", function (e) {
            mousePosition.x = e.offsetX;
            mousePosition.y = e.offsetY;

            let x = e.offsetX - originX / 2;
            let y = e.offsetY - cMargin / 2;
            if (y > 0 && x > 0) {
                let positionx = 1;
                for (let i = 0; i < totalBars; i++) {
                    if (x >= (cWidth / 2 / totalBars) * i) {
                        positionx = i + 1;
                    }
                }
                let xx = originX + ((bWidth + bMargin) * (positionx - 1) + bMargin);

                drawBody();
                if (e.offsetY * 2 < originY) {
                    drawLineWithColor(xx + bWidth / 2 - 1, cMargin, xx + bWidth / 2 - 1, cMargin + cHeight, "white");

                    let vx = e.offsetX + cWidth / 5;
                    let vy = e.offsetY;
                    ctx.beginPath();
                    ctx.moveTo(vx, vy);
                    ctx.lineTo(vx + 200, vy);
                    ctx.lineTo(vx + 200, vy + 330);
                    ctx.lineTo(vx, vy + 330);
                    ctx.lineTo(vx, vy);
                    ctx.lineWidth = 2;
                    ctx.fillStyle = "rgba(104,113,130,0.5)";
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "white";
                    ctx.textAlign = "left";
                    ctx.font = "26px Verdana";
                    ctx.fillText(monthly[positionx - 1].year + "-" + monthly[positionx - 1].month, vx + 20, vy + 30, 150);
                    ctx.font = "22px Verdana";
                    ctx.fillText("平均气温：" + monthly[positionx - 1].avg_temp, vx + 20, vy + 70, 150);
                    ctx.fillText("降雨量：" + monthly[positionx - 1].amt_rain, vx + 20, vy + 105, 150);
                    ctx.fillText("降雨天数：" + monthly[positionx - 1].num_rain, vx + 20, vy + 140, 150);
                    ctx.fillText("降雪天数：" + monthly[positionx - 1].num_snow, vx + 20, vy + 175, 150);
                    ctx.fillText("暴雨天数：" + monthly[positionx - 1].num_storm, vx + 20, vy + 210, 150);
                    ctx.fillText("火灾数量：" + monthly[positionx - 1].num_fire, vx + 20, vy + 245, 150);
                    ctx.fillText("最大火灾：" + monthly[positionx - 1].max_level_fire, vx + 20, vy + 280, 150);
                }
            } else {
                e = e || window.event;
                if (e.offsetX || e.offsetX === 0) {
                    mousePosition.x = e.offsetX;
                    mousePosition.y = e.offsetY;
                } else if (e.layerX || e.layerX === 0) {
                    mousePosition.x = e.layerX;
                    mousePosition.y = e.layerY;
                }

                drawBody();
            }
        });
    }

    function getDaysInMonth(m, y) {
        return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);
    }

    drawRightUpPanel.canvas.onmousedown = function (e) {
        if (ctx.isPointInPath(drawRightUpPanel.properties.avg_temp.clickObj, e.offsetX * 2, e.offsetY * 2)) drawRightUpPanel.properties.avg_temp.show = !drawRightUpPanel.properties.avg_temp.show;
        else if (ctx.isPointInPath(drawRightUpPanel.properties.amt_rain.clickObj, e.offsetX * 2, e.offsetY * 2)) drawRightUpPanel.properties.amt_rain.show = !drawRightUpPanel.properties.amt_rain.show;
        else if (ctx.isPointInPath(drawRightUpPanel.properties.num_rain.clickObj, e.offsetX * 2, e.offsetY * 2)) drawRightUpPanel.properties.num_rain.show = !drawRightUpPanel.properties.num_rain.show;
        else if (ctx.isPointInPath(drawRightUpPanel.properties.num_snow.clickObj, e.offsetX * 2, e.offsetY * 2)) drawRightUpPanel.properties.num_snow.show = !drawRightUpPanel.properties.num_snow.show;
        else if (ctx.isPointInPath(drawRightUpPanel.properties.num_storm.clickObj, e.offsetX * 2, e.offsetY * 2)) drawRightUpPanel.properties.num_storm.show = !drawRightUpPanel.properties.num_storm.show;
        else if (ctx.isPointInPath(drawRightUpPanel.properties.num_fire.clickObj, e.offsetX * 2, e.offsetY * 2)) drawRightUpPanel.properties.num_fire.show = !drawRightUpPanel.properties.num_fire.show;
        else if (ctx.isPointInPath(drawRightUpPanel.properties.max_level_fire.clickObj, e.offsetX * 2, e.offsetY * 2)) drawRightUpPanel.properties.max_level_fire.show = !drawRightUpPanel.properties.max_level_fire.show;

        if (ctx.isPointInPath(drawRightUpPanel.ctrl1, e.offsetX * 2, e.offsetY * 2)) {
            drawRightUpPanel.modifyCtrl1 = true;
            drawRightUpPanel.modifyCtrl2 = false;
        } else if (drawRightUpPanel.ctrl2 && ctx.isPointInPath(drawRightUpPanel.ctrl2, e.offsetX * 2, e.offsetY * 2)) {
            drawRightUpPanel.modifyCtrl1 = false;
            drawRightUpPanel.modifyCtrl2 = true;
        }

        document.onmousemove = function (e) {
            let x = e.offsetX - originX / 2;
            let positionX = 1;
            for (let i = 0; i < totalBars; i++) {
                if (x >= (cWidth / 2 / totalBars) * i) {
                    positionX = i + 1;
                }
            }
            if (drawRightUpPanel.modifyCtrl1) {
                let newTime = new Date(0);
                newTime.setFullYear(monthly[positionX - 1].year);
                newTime.setMonth(monthly[positionX - 1].month);
                if (newTime.getTime() > end.getTime()) {
                    end.setFullYear(newTime.getFullYear());
                    end.setMonth(newTime.getMonth());
                    end.setDate(getDaysInMonth(end.getMonth(), end.getFullYear()));
                    end.setHours(23);
                    end.setMinutes(59);
                    end.setSeconds(59);
                    drawRightUpPanel.modifyCtrl1 = false;
                    drawRightUpPanel.modifyCtrl2 = true;
                } else {
                    begin = newTime;
                }
            } else if (drawRightUpPanel.modifyCtrl2) {
                end.setFullYear(monthly[positionX - 1].year);
                end.setMonth(monthly[positionX - 1].month);
                if (end.getTime() < begin.getTime()) {
                    end.setFullYear(begin.getFullYear());
                    end.setMonth(begin.getMonth());
                }
            }
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            drawRightUpPanel.modifyCtrl1 = false;
            drawRightUpPanel.modifyCtrl2 = false;
            drawRightMidLeftPanel();
            drawRightMidRightPanel();
            drawRightBotPanel();
            redrawMap();
        }
    }
}

function drawRightMidLeftPanel() {
    if (drawRightMidLeftPanel.canvas === undefined) {
        drawRightMidLeftPanel.canvas = document.createElement("canvas");
        drawRightMidLeftPanel.canvas.width = 300;
        drawRightMidLeftPanel.canvas.height = 300;
        drawRightMidLeftPanel.ctx = drawRightMidLeftPanel.canvas.getContext("2d");
        let cBox = document.getElementById("right-mid-left-panel");
        cBox.appendChild(drawRightMidLeftPanel.canvas);

        drawRightMidLeftPanel.canvas.addEventListener("click", (event) => {
            let clicked = false;
            for (const arc of drawRightMidLeftPanel.arcs) {
                if (drawRightMidLeftPanel.ctx.isPointInPath(arc, event.offsetX, event.offsetY) && typeSelected.filterType !== arc.reason) {
                    typeSelected.filterType = arc.reason;
                    clicked = true;
                    break;
                }
            }
            if (!clicked) typeSelected.filterType = "";

            redraw();
        });
    }

    function getColor(reason) {
        let scheme = {
            '居住场所': 'rgba(192,57,43,0.3)',
            '其他': 'rgba(212,172,13,0.3)',
            '垃圾堆': 'rgba(0,102,102,0.3)',
            '轿车': 'rgba(106,27,154,0.3)',
            '餐饮场所': 'rgba(173,20,87,0.3)',
            '学校': 'rgba(40,53,147,0.3)',
            '商业场所': 'rgba(0,137,123,0.3)',
            '工地': 'rgba(216,67,21,0.3)',
            '货车': 'rgba(126,87,194,0.3)',
            '办公场所': 'rgba(175,180,43,0.3)',
            '露天堆垛': 'rgba(244,81,30,0.3)',
            '公园': 'rgba(84,110,122,0.3)',
            '厂房': 'rgba(161,136,127,0.3)',
            '物资仓储': 'rgba(77,182,172,0.3)',
            '宾馆': 'rgba(156,39,176,0.3)',
            '室外设备': 'rgba(255,112,67,0.3)',
            '绿化带': 'rgba(102,187,106,0.3)',
            '交通枢纽': 'rgba(94,53,177,0.3)',
            '客车': 'rgba(236,64,122,0.3)',
            '垃圾箱': 'rgba(255,128,171,0.3)',
            '电动车': 'rgba(41,182,246,0.3)',
            '露天场所': 'rgba(156,204,101,0.3)',
            '汽车库': 'rgba(255,183,77,0.3)',
            '娱乐场所': 'rgba(186,104,200,0.3)',
            '医疗机构': 'rgba(120,144,156,0.3)',
            '室外市场': 'rgba(161,136,127,0.3)',
            '通信场所': 'rgba(124,179,66,0.3)',
            '特种车': 'rgba(141,110,99,0.3)',
            '宗教场所': 'rgba(144,164,174,0.3)',
            '石油化工': 'rgba(142,36,170,0.3)',
            '科研试验': 'rgba(158,157,36,0.3)',
            '体育场馆': 'rgba(140,158,255,0.3)',
            '轨道交通': 'rgba(67,160,71,0.3)',
            '室内农副': 'rgba(126,87,194,0.3)',
            '修车库': 'rgba(171,71,188,0.3)',
            '船舶': 'rgba(255,112,67,0.3)',
            '加油站': 'rgba(92,107,192,0.3)',
            '会展中心': 'rgba(38,166,154,0.3)',
            '文物古建筑': 'rgba(239,108,0,0.3)',
            '文博馆': 'rgba(206,147,216,0.3)',
            '垃圾场': 'rgba(255,204,128,0.3)',
            '摩托车': 'rgba(197,225,165,0.3)',
            '废品回收': 'rgba(255,171,145,0.3)',
            '森林': 'rgba(128,203,196,0.3)',
            '金融交易': 'rgba(159,168,218,0.3)',
            '养老院': 'rgba(188,170,164,0.3)',
        }

        let else_color = 'rgba(177,89,40,0.3)';
        if (scheme[reason] === undefined) return else_color;
        return scheme[reason];
    }

    redraw();

    function redraw() {
        drawRightMidLeftPanel.ctx.clearRect(0, 0, drawRightMidLeftPanel.canvas.width, drawRightMidLeftPanel.canvas.height);

        let count_reason = {}
        for (const fireElement of fire) {
            if (inTimePeriod(fireElement) && fireSelected(fireElement)) {
                if (fireElement.type in count_reason) count_reason[fireElement.type] += 1;
                else count_reason[fireElement.type] = 1;
            }
        }

        // Descending order
        count_reason = Object.entries(count_reason).sort((a, b) => (b[1] - a[1]));

        let position = [[15, 210], [125, 210], [15, 240], [125, 240], [15, 270], [125, 270]]
        let currentAngle = 0;
        let sum = count_reason.map(v => v[1])
            .reduce((a, b) => (a + b));
        let idx = 0;
        drawRightMidLeftPanel.ctx.font = "18px Verdana";
        drawRightMidLeftPanel.arcs = [];

        let displayText = [0, 0, "", ""];

        for (let reason of count_reason) {
            let portionAngle = (reason[1] / sum) * 2 * Math.PI;
            let path = new Path2D();

            if (typeSelected.filterType === reason[0]) {
                drawRightMidLeftPanel.ctx.fillStyle = getColor(reason[0]).replace(/[^,]+(?=\))/, "1");
                path.arc(125, 100, 105, currentAngle, currentAngle + portionAngle);
                displayText = [
                    125 + Math.cos(currentAngle + portionAngle / 2) * 50,
                    100 + Math.sin(currentAngle + portionAngle / 2) * 50,
                    reason[0],
                    String(Math.trunc(reason[1] / sum * 1000) / 10) + "%"
                ];
            } else if (typeSelected.filterType === "") {
                drawRightMidLeftPanel.ctx.fillStyle = getColor(reason[0]).replace(/[^,]+(?=\))/, "1");
                path.arc(125, 100, 100, currentAngle, currentAngle + portionAngle);
            } else {
                drawRightMidLeftPanel.ctx.fillStyle = getColor(reason[0]);
                path.arc(125, 100, 100, currentAngle, currentAngle + portionAngle);
            }
            currentAngle += portionAngle;
            path.lineTo(125, 100);

            if (idx < position.length) {
                let pos = position[idx];
                path.rect(pos[0], pos[1], 20, 20);
                drawRightMidLeftPanel.ctx.fillText(reason[0], pos[0] + 25, pos[1] + 17);
            }
            drawRightMidLeftPanel.ctx.fill(path);
            path.reason = reason[0];
            drawRightMidLeftPanel.arcs.push(path);
            ++idx;
        }
        drawRightMidLeftPanel.ctx.font = "22px Verdana";
        drawRightMidLeftPanel.ctx.fillStyle = "white";
        drawRightMidLeftPanel.ctx.textAlign = "center";
        drawRightMidLeftPanel.ctx.fillText(displayText[2], displayText[0], displayText[1] - 5);
        drawRightMidLeftPanel.ctx.fillText(displayText[3], displayText[0], displayText[1] + 15);
        drawRightMidLeftPanel.ctx.textAlign = "left";
        redrawMap();
        drawRightMidRightPanel();
        drawRightBotPanel(); /* In case of losing context */
    }
}

function drawRightMidRightPanel() {
    let data = fire.filter(inTimePeriod).filter(fireSelected);
    let points = [{
        type: 'parcoords',
        line: {
            cmin: 0,
            cmax: 100,
            color: data.filter(typeSelected).map(row => row['level']),
            colorscale: [
                [0.0, 'rgba(5,10,172,0.75)'],
                [0.35, 'rgba(106,137,247,0.75)'],
                [0.5, 'rgba(190,190,190,0.75)'],
                [0.6, 'rgba(220,170,132,0.75)'],
                [0.7, 'rgba(230,145,90,0.75)'],
                [1.0, 'rgba(178,10,28,0.75)']
            ],
        },
        unselected: {
            line: {
                color: "#313131",
                opacity: 0.1
            }
        },

        dimensions: [{
            range: [0, 100],
            label: '\u706b\u60c5\uff08\u961f\uff09', // 火情（队）
            values: data.filter(typeSelected).map(row => row['level']),
        }, {
            range: [0, 18000],
            label: '\u4eba\u53e3\u5bc6\u5ea6', // 人口密度
            values: data.filter(typeSelected).map(row => row['popu'])
        }, {
            range: [0, 18000],
            label: '\u4f01\u4e1a\u5bc6\u5ea6', // 企业密度
            values: data.filter(typeSelected).map(row => row['indu'])
        }]
    }];

    drawRightMidRightPanel.graph = document.getElementById('right-mid-right-panel');
    drawRightMidRightPanel.constraintranges = [undefined, undefined, undefined];
    let layout = {
        height: 300,
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        margin: {
            l: 40,
            r: 45,
            b: 35,
            t: 50,
        },
        font: {
            family: 'Verdana',
            size: 18,
            color: 'rgba(255, 255, 255, 1)'
        },
    };

    Plotly.newPlot(drawRightMidRightPanel.graph, points, layout, {displayModeBar: false});
    drawRightMidRightPanel.graph.on('plotly_restyle', function (data) {
            drawRightMidRightPanel.constraintranges = [
                drawRightMidRightPanel.graph._fullData[0].dimensions[0].constraintrange,
                drawRightMidRightPanel.graph._fullData[0].dimensions[1].constraintrange,
                drawRightMidRightPanel.graph._fullData[0].dimensions[2].constraintrange
            ]

        });
}

function drawRightBotPanel() {
    let data = fire.filter(inTimePeriod);
    let filtered_station = fire_station.filter(beforeEndTime);
    for (const filteredStationElement of filtered_station) {
        filteredStationElement["count"] = 0;
        filteredStationElement["popu"] = 0;
        filteredStationElement["indu"] = 0;
    }

    for (const datum of data) {
        for (const fighter of datum["fighters"]) {
            for (const filteredStationElement of filtered_station) {
                if (filteredStationElement["station_code"] === fighter) {
                    filteredStationElement["count"] += 1;
                    filteredStationElement["popu"] = Math.max(datum["popu"], filteredStationElement["popu"]);
                    filteredStationElement["indu"] = Math.max(datum["indu"], filteredStationElement["indu"]);
                    break;
                }
            }
        }
    }

    function linspace(start, stop) {
        const step = (stop - start) / 4;
        return Array.from({length: 5}, (_, i) => start + step * i);
    }

    let ticks = linspace(Math.min(...filtered_station.map(row => (row['time'].getTime()))), Math.max(...filtered_station.map(row => (row['time'].getTime()))));

    let points = [{
        type: 'parcoords',
        line: {
            cmin: 0,
            cmax: 100,
            color: filtered_station.map(row => row['level']),
            colorscale: [
                [0.0, 'rgba(5,10,172,0.75)'],
                [0.35, 'rgba(106,137,247,0.75)'],
                [0.5, 'rgba(190,190,190,0.75)'],
                [0.6, 'rgba(220,170,132,0.75)'],
                [0.7, 'rgba(230,145,90,0.75)'],
                [1.0, 'rgba(178,10,28,0.75)']
            ]
        },
        unselected: {
            line: {
                color: "#313131",
                opacity: 0.1
            }
        },

        dimensions: [{
            label: '\u7b49\u7ea7', // 等级
            values: filtered_station.map(row => row['level'])
        }, {
            label: '\u6295\u7528\u5e74\u6708', // 投用年月
            values: filtered_station.map(row => (row['time'].getTime())),
            ticktext: ticks.map((t) => {
                let time = new Date(t);
                return time.getFullYear() + "-" + Math.max(1, time.getMonth());
            }),
            tickvals: ticks.map((t) => new Date(t)),
        }, {
            label: '\u51fa\u8b66\u9891\u7387\uff08\u6b21\u002f\u5929\uff09', // 出警频率（次/天）
            values: filtered_station.map(row => {
                if (begin < row["time"]) return row['count'] / ((end - row["time"]) / 1000 / 3600 / 24)
                else return row['count'] / ((end - begin) / 1000 / 3600 / 24)
            })
        }, {
            label: '\u4eba\u53e3\u5bc6\u5ea6', // 人口密度
            values: filtered_station.map(row => row['popu'])
        }, {
            label: '\u4f01\u4e1a\u5bc6\u5ea6', // 企业密度
            values: filtered_station.map(row => row['indu'])
        }]
    }];

    let layout = {
        width: 600,
        height: 300,
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        margin: {
            l: 80,
            r: 50,
            b: 50,
            t: 50,
        },
        font: {
            family: 'Verdana',
            size: 18,
            color: 'rgba(255, 255, 255, 1)'
        },
    };

    Plotly.newPlot('right-bot-panel', points, layout, {displayModeBar: false});
}
