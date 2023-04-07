const CELL_SIZE  = 20;
let maze = [];

window.addEventListener('load', function() {
  let divContainer = document.getElementById('astar-div');
  let newCanvas = document.createElement('canvas');
  newCanvas.setAttribute('id', 'astar-canvas');
  newCanvas.width = 
  divContainer.appendChild(newCanvas);
});

class Cell {
  constructor(x, y, isOccupied) {
    this.x = x;
    this.y = y;
    this.isOccupied = isOccupied;
    this.wallImage = new Image();
    this.wallImage.src = 'images/BrickGrey.png';
  }

  makeWall() {
    const xPos = this.x * CELL_SIZE;
    const yPos = this.y * CELL_SIZE;
    if (this.isOccupied == false) {
      const aStarCanvas = document.getElementById("astar-canvas");
      const ctx = aStarCanvas.getContext("2d");
      ctx.drawImage(this.wallImage, xPos, yPos, CELL_SIZE, CELL_SIZE);
    }
  }
}

function createMaze(MAZE_WIDTH, MAZE_HEIGHT) {
  for (let y = 0; y < MAZE_HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < MAZE_WIDTH; x++) {
      const cell = new Cell(x, y, false);
      row.push(cell);
      cell.makeWall();
    }
    maze.push(row);
  }
}