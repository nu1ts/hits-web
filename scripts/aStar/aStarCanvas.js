export function makeWall(map, w, h) {
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(150, 50);
    ctx.lineTo(150, 150);
    ctx.lineTo(50, 150);
    ctx.closePath();
    ctx.fillStyle = '#1a2edb';
    ctx.fill();
    ctx.stroke();
}