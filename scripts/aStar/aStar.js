class Cell {
    constructor(x, y, isOccupied) {
      this.x = x;
      this.y = y;
      this.isOccupied = isOccupied;
    }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function makeWall(x, y, width, height) {
  window.addEventListener('load', () => {
    let canvas = document.getElementById('astar-canvas');
    let ctx = canvas.getContext('2d');

    let wall = new Image();
    wall.src = 'images/wall.png';

    wall.onload = function() {
      ctx.drawImage(wall, x, y, width, height);
    }
  });
}

function clearCell(x, y, width, height) {

}

function createMap(width, height) {
    let map = new Array(width);
    for (let w = 0; w < width; w++) {
      map[w] = new Array(height);
      for (let h = 0; h < height; h++) {
        map[w][h] = new Cell(w, h, false);
        makeWall(0, 0, w, h);
      }
    }

    let x = Math.floor(Math.random() * width / 2) * 2 + 1;
    let y = Math.floor(Math.random() * height / 2) * 2 + 1;
    clearCell();

    let to_check = new Array();
    if (y - 2 >= 0) {
        to_check.push(new Point(x, y - 2));
    }
    if (y + 2 < height) {
        to_check.push(new Point(x, y + 2));
    }
    if (x - 2 >= 0) {
        to_check.push(new Point(x - 2, y));
    }
    if (x + 2 < width) {
        to_check.push(new Point(x + 2, y));
    }
}