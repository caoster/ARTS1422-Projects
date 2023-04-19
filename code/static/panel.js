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
            "population": true,
            "enterprise": false,
            "select": false
        }
        console.log(drawLeftPanel.settings)
        drawLeftPanel.canvas.addEventListener("click", (event) => {
            if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.fire_button, event.offsetX, event.offsetY)) drawLeftPanel.settings.fire = !drawLeftPanel.settings.fire;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.fire_station_button, event.offsetX, event.offsetY)) drawLeftPanel.settings.fire_station = !drawLeftPanel.settings.fire_station;
            else if (drawLeftPanel.ctx.isPointInPath(display_area, event.offsetX, event.offsetY)) drawLeftPanel.settings.show_area = !drawLeftPanel.settings.show_area;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.scale_5_button, event.offsetX, event.offsetY) && drawLeftPanel.settings.show_area) drawLeftPanel.settings.minute = 5;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.scale_10_button, event.offsetX, event.offsetY) && drawLeftPanel.settings.show_area) drawLeftPanel.settings.minute = 10;
            else if (drawLeftPanel.ctx.isPointInPath(drawLeftPanel.scale_15_button, event.offsetX, event.offsetY) && drawLeftPanel.settings.show_area) drawLeftPanel.settings.minute = 15;
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
    }

    /* Background */
    rounded_rect(3, 3, 237, 481, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');
    if (drawLeftPanel.settings.fire)
        drawLeftPanel.fire_button = rounded_rect(17, 16, 209, 50, 20, 'rgba(251, 61, 95, 1)', 'rgba(251, 61, 95, 0.4)');
    else
        drawLeftPanel.fire_button = rounded_rect(17, 16, 209, 50, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)');
    rounded_rect(17, 96, 209, 145, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');
    if (drawLeftPanel.settings.fire_station)
        drawLeftPanel.fire_station_button = rounded_rect(17, 96, 209, 50, 20, 'rgba(27, 169, 101, 1)', 'rgba(27, 169, 101, 0.4)');
    else
        drawLeftPanel.fire_station_button = rounded_rect(17, 96, 209, 50, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)');
    drawLeftPanel.ctx.font = "bold 20px IBM Plex Sans Hebrew";
    drawLeftPanel.ctx.fillStyle = "white";
    drawLeftPanel.ctx.textAlign = "center";

    drawImage("static/texture/fire.png", 60, 20, 0.5);
    drawLeftPanel.ctx.fillText("火灾", 134, 48.5);
    drawImage("static/texture/fire_station.png", 50, 100, 0.5);
    drawLeftPanel.ctx.fillText("消防站", 144, 128.5);

    let display_area = rounded_rect(27, 156, 189, 40, 20, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');

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
        drawLeftPanel.scale_5_button = rounded_rect(25, 194, 35, 40, 10, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.5)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    } else {
        drawLeftPanel.scale_5_button = rounded_rect(25, 194, 35, 40, 10, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    }
    drawLeftPanel.ctx.fillText("5", 44, 220);

    if (drawLeftPanel.settings.show_area && drawLeftPanel.settings.minute === 10) {
        drawLeftPanel.scale_10_button = rounded_rect(71, 194, 35, 40, 10, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.5)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    } else {
        drawLeftPanel.scale_10_button = rounded_rect(71, 194, 35, 40, 10, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    }
    drawLeftPanel.ctx.fillText("10", 88, 220);

    if (drawLeftPanel.settings.show_area && drawLeftPanel.settings.minute === 15) {
        drawLeftPanel.scale_15_button = rounded_rect(115, 194, 35, 40, 10, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.5)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    } else {
        drawLeftPanel.scale_15_button = rounded_rect(115, 194, 35, 40, 10, 'rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0)');
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    }
    drawLeftPanel.ctx.fillText("15", 132, 220);
    if (drawLeftPanel.settings.show_area)
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    else
        drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    drawLeftPanel.ctx.fillText("min", 182, 220);

    rounded_rect(17, 274, 209, 111, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');

    if (drawLeftPanel.settings.population)
        drawLeftPanel.population_button = rounded_rect(17, 274, 209, 54, 20, 'rgba(227, 209, 110, 1)', 'rgba(227, 209, 110, 0.4)');
    else
        drawLeftPanel.population_button = rounded_rect(17, 274, 209, 54, 20, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)');
    drawImage("static/texture/people.png", 50, 280, 0.5);
    drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    drawLeftPanel.ctx.fillText("人口密度", 140, 309);

    drawLeftPanel.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    drawLeftPanel.ctx.moveTo(17, 328);
    drawLeftPanel.ctx.lineTo(226, 328);
    drawLeftPanel.ctx.stroke();
    if (drawLeftPanel.settings.enterprise)
        drawLeftPanel.enterprise_button = rounded_rect(17, 331, 209, 54, 20, 'rgba(184, 155, 221, 1)', 'rgba(184, 155, 221, 0.4)');
    else
        drawLeftPanel.enterprise_button = rounded_rect(17, 331, 209, 54, 20, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)');
    drawImage("static/texture/enterprise.png", 50, 337, 0.5);
    drawLeftPanel.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    drawLeftPanel.ctx.fillText("企业密度", 140, 365);

    if (drawLeftPanel.settings.select)
        drawLeftPanel.select_button = rounded_rect(17, 410, 209, 50, 20, 'rgb(31, 88, 180)', 'rgba(31, 88, 180, 0.4)');
    else
        drawLeftPanel.select_button = rounded_rect(17, 410, 209, 50, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)');
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

    function rounded_rect(left, top, width, height, radius, stroke, fill) {
        let K = 4 * (Math.SQRT2 - 1) / 3; //constant for circles using Bezier curve.
        let right = left + width;
        let bottom = top + height;
        let path = new Path2D();
        drawLeftPanel.ctx.beginPath();
        // top left
        path.moveTo(left + radius, top);
        // top right
        path.lineTo(right - radius, top);
        //right top
        path.bezierCurveTo(right + radius * (K - 1), top, right, top + radius * (1 - K), right, top + radius);
        //right bottom
        path.lineTo(right, bottom - radius);
        //bottom right
        path.bezierCurveTo(right, bottom + radius * (K - 1), right + radius * (K - 1), bottom, right - radius, bottom);
        //bottom left
        path.lineTo(left + radius, bottom);
        //left bottom
        path.bezierCurveTo(left + radius * (1 - K), bottom, left, bottom + radius * (K - 1), left, bottom - radius);
        //left top
        path.lineTo(left, top + radius);
        //top left again
        path.bezierCurveTo(left, top + radius * (1 - K), left + radius * (1 - K), top, left + radius, top);

        drawLeftPanel.ctx.closePath();
        drawLeftPanel.ctx.lineWidth = 3;
        drawLeftPanel.ctx.strokeStyle = stroke;
        drawLeftPanel.ctx.fillStyle = fill;
        drawLeftPanel.ctx.stroke(path);
        drawLeftPanel.ctx.fill(path);
        return path;
    }
}
