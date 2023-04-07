class Cell {
    constructor(x, y, isOccupied) {
      this.x = x;
      this.y = y;
      this.isOccupied = isOccupied;
    }

    makeWall() {
      var canvas = document.getElementById("astar-canvas");
      var ctx = canvas.getContext("2d");
      var wall = new Image();
      wall.onload = function() {
        ctx.drawImage(wall, this.x, this.y, this.x, this.y);
      }
      wall.src = 'images/wall.png';
    }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

window.addEventListener('load', function() {
  var divContainer = document.getElementById('astar');
  var canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'astar-canvas');
  divContainer.appendChild(canvas);
});

function clearCell(x, y, width, height) {
  
}

function createMap(width, height) {
  let map = new Array(width);
  let cellWidth = width * 30 / 100;
  let cellHeight = height * 30 / 100;
  for (let x = 0; x < width; x + cellWidth) {
    map[x] = new Array(height);
    for (let y = 0; y < height; y + cellHeight) {
      map[x][y] = new Cell(x, y, true);
      map[x][y].makeWall();
    }
  }
}