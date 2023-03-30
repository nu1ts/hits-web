function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width / bbox.width), y: y - bbox.top * (canvas.height / bbox.height) };
}

var canvas = document.getElementById("canvas1");
    ctx     = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth*0.6;
canvas.height = document.documentElement.clientHeight*0.6;

canvas.addEventListener('mousedown',
function(e) {
    var loc = windowToCanvas(canvas, e.clientX, e.clientY);
    ctx.beginPath();
    ctx.arc(loc.x, loc.y, 10, 0, Math.PI*2);
    ctx.fill();
});