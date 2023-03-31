function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width / bbox.width), y: y - bbox.top * (canvas.height / bbox.height) };
}

var canvas = document.getElementById("canvas0");
    ctx     = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth*0.9905;
canvas.height = document.documentElement.clientHeight*0.85;