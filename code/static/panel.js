function drawLeftPanel() {
    let canvas = document.createElement('canvas');
    canvas.width = 243;
    canvas.height = 487;
    canvas.id = "left-panel-bg";

    let ctx = canvas.getContext('2d');
    document.getElementById("left-panel").appendChild(canvas);
    rounded_rect(ctx, 3, 3, 237, 481, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');
    rounded_rect(ctx, 17, 16, 209, 50, 20, 'rgba(251, 61, 95, 1)', 'rgba(251, 61, 95, 0.4)');
    rounded_rect(ctx, 17, 96, 209, 145, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');
    rounded_rect(ctx, 17, 96, 209, 50, 20, 'rgba(27, 169, 101, 1)', 'rgba(27, 169, 101, 0.4)');
    ctx.font = "bold 20px IBM Plex Sans Hebrew";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    drawImage("static/texture/fire.png", 60, 20, 0.5);
    ctx.fillText("火灾", 134, 48.5);
    drawImage("static/texture/fire_station.png", 50, 100, 0.5);
    ctx.fillText("消防站", 144, 128.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText("显示服务范围", 98, 182);

    let checkmark = new Path2D("M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597z");
    ctx.transform(1, 0, 0, 1, 175, 163);
    ctx.fill(checkmark);
    ctx.transform(1, 0, 0, 1, -175, -163);

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText("5", 44, 220);
    ctx.fillText("10", 88, 220);
    ctx.fillText("15", 132, 220);
    ctx.fillText("min", 182, 220);

    rounded_rect(ctx, 17, 274, 209, 111, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.4)');

    rounded_rect(ctx, 17, 274, 209, 54, 20, 'rgba(227, 209, 110, 1)', 'rgba(227, 209, 110, 0.4)');
    drawImage("static/texture/people.png", 50, 280, 0.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText("人口密度", 140, 309);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.moveTo(17, 328);
    ctx.lineTo(226, 328);
    ctx.stroke();

    rounded_rect(ctx, 17, 331, 209, 54, 20, 'rgba(184, 155, 221, 1)', 'rgba(184, 155, 221, 0.4)');
    drawImage("static/texture/enterprise.png", 50, 337, 0.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText("企业密度", 140, 365);

    rounded_rect(ctx, 17, 410, 209, 50, 20, 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)');
    drawImage("static/texture/select.png", 65, 420, 0.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText("框选", 134, 443);

    function drawImage(path, x, y, scale) {
        let drawing = new Image();
        drawing.src = path;
        drawing.onload = function () {
            ctx.drawImage(drawing, x, y, drawing.width * scale, drawing.height * scale);
        };
    }

    function rounded_rect(ctx, left, top, width, height, radius, stroke, fill) {
        let K = 4 * (Math.SQRT2 - 1) / 3; //constant for circles using Bezier curve.
        let right = left + width;
        let bottom = top + height;
        ctx.beginPath();
        // top left
        ctx.moveTo(left + radius, top);
        // top right
        ctx.lineTo(right - radius, top);
        //right top
        ctx.bezierCurveTo(right + radius * (K - 1), top, right, top + radius * (1 - K), right, top + radius);
        //right bottom
        ctx.lineTo(right, bottom - radius);
        //bottom right
        ctx.bezierCurveTo(right, bottom + radius * (K - 1), right + radius * (K - 1), bottom, right - radius, bottom);
        //bottom left
        ctx.lineTo(left + radius, bottom);
        //left bottom
        ctx.bezierCurveTo(left + radius * (1 - K), bottom, left, bottom + radius * (K - 1), left, bottom - radius);
        //left top
        ctx.lineTo(left, top + radius);
        //top left again
        ctx.bezierCurveTo(left, top + radius * (1 - K), left + radius * (1 - K), top, left + radius, top);
        ctx.lineWidth = 3;
        ctx.strokeStyle = stroke;
        ctx.fillStyle = fill;
        ctx.stroke();
        ctx.fill();
    }
}


drawLeftPanel();
