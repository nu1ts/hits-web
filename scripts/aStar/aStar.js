const CELL_SIZE  = 16;
let maze = [];

window.addEventListener('load', function() {
  const divContainer = document.getElementById('astar-div');
  const newCanvas = document.createElement('canvas');
  newCanvas.setAttribute('id', 'astar-canvas');
  divContainer.appendChild(newCanvas);
});

//CLASSES
class Cell {
  constructor(x, y, isClear) {
    this.x = x;
    this.y = y;
    this.isClear = isClear;
    this.wallImage = new Image();
    this.wallImage.src = 'images/BlackWall.png';
    this.floorImage = new Image();
    this.floorImage.src = 'images/WhiteFloor.png';
  }

  makeWall() {
    const X_POSITION = this.x * CELL_SIZE;
    const Y_POSITION = this.y * CELL_SIZE;
    if (this.isClear) {
      const CANVAS = document.getElementById("astar-canvas");
      const CTX = CANVAS.getContext("2d");
      CTX.drawImage(this.wallImage, X_POSITION, Y_POSITION, CELL_SIZE, CELL_SIZE);
      this.isClear = false;
    }
  }

  clearCell() {
    const X_POSITION = this.x * CELL_SIZE;
    const Y_POSITION = this.y * CELL_SIZE;
    const CANVAS = document.getElementById("astar-canvas");
    const CTX = CANVAS.getContext("2d");
    CTX.drawImage(this.floorImage, X_POSITION, Y_POSITION, CELL_SIZE, CELL_SIZE);
    this.isClear = true;
  }
}

//MAP
function createMaze(MAZE_WIDTH, MAZE_HEIGHT) {
  const CANVAS = document.getElementById("astar-canvas");
  CANVAS.width = CELL_SIZE * MAZE_WIDTH;
  CANVAS.height = CELL_SIZE * MAZE_HEIGHT;
  
  for (let y = 0; y < MAZE_HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < MAZE_WIDTH; x++) {
      const cell = new Cell(x, y, true);
      cell.makeWall();
      row.push(cell);
    }
    maze.push(row);
  }

  let x = Math.floor(Math.random() * MAZE_WIDTH / 2) * 2 + 1;
  let y = Math.floor(Math.random() * MAZE_HEIGHT / 2) * 2 + 1;
  maze[x][y].clearCell();

  let toCheck = [];
  if (y - 2 >= 0) {
    toCheck.push(new Cell(x, y - 2));
  }
  if (y + 2 < MAZE_HEIGHT) {
    toCheck.push(new Cell(x, y + 2));
  }
  if (x - 2 >= 0) {
    toCheck.push(new Cell(x - 2, y));
  }
  if (x + 2 < MAZE_WIDTH) {
    toCheck.push(new Cell(x + 2, y));
  }

  while (toCheck.length > 0) {
    let index = Math.floor(Math.random() * toCheck.length);
    let cell = toCheck[index];
    let x = cell.x;
    let y = cell.y;
    maze[x][y].clearCell();
    toCheck.splice(index, 1);
    
    let direction = ["north", "south", "east", "west"];
    while (direction.length > 0) {
      let dirIndex = Math.floor(Math.random() * direction.length);
      switch (direction[dirIndex]) {
        case "north":
          if (y - 2 >= 0 && maze[x][y - 2].isClear) {
            maze[x][y - 1].clearCell();
            direction.splice(0, direction.length);
          }
        break;
        case "south":
          if (y + 2 < MAZE_HEIGHT && maze[x][y + 2].isClear) {
            maze[x][y + 1].clearCell();
            direction.splice(0, direction.length);
          }
        break;
        case "east":
          if (x - 2 >= 0 && maze[x - 2][y].isClear) {
            maze[x - 1][y].clearCell();
            direction.splice(0, direction.length);
          }
        break;
        case "west":
          if (x + 2 < MAZE_WIDTH && maze[x + 2][y].isClear) {
            maze[x + 1][y].clearCell();
            direction.splice(0, direction.length);
          }
        break;
      }
      direction.splice(dirIndex, 1);
    }

    if (y - 2 >= 0 && !(maze[x][y - 2].isClear)) {
      toCheck.push(new Cell(x, y - 2));
    }
    if (y + 2 < MAZE_HEIGHT && !(maze[x][y + 2].isClear)) {
      toCheck.push(new Cell(x, y + 2));
    }
    if (x - 2 >= 0 && !(maze[x - 2][y].isClear)) {
      toCheck.push(new Cell(x - 2, y));
    }
    if (x + 2 < MAZE_WIDTH && !(maze[x + 2][y].isClear)) {
      toCheck.push(new Cell(x + 2, y));
    }
  }

  deleteDeadEnds(MAZE_WIDTH, MAZE_HEIGHT);
}

function deleteDeadEnds(MAZE_WIDTH, MAZE_HEIGHT) {
  for (let i = 0; i < 4; i++) {
    let deadEnds = new Array();
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (maze[x][y].isClear) {
          let neighbors = 0;
          if (y - 1 >= 0 && maze[x][y - 1].isClear) {
            neighbors++;
          }
          if (y + 1 < MAZE_HEIGHT && maze[x][y + 1].isClear) {
            neighbors++;
          }
          if (x - 1 >= 0 && maze[x - 1][y].isClear) {
            neighbors++;
          }
          if (x + 1 < MAZE_WIDTH && maze[x + 1][y].isClear) {
            neighbors++;
          }
          if (neighbors <= 1) {
            deadEnds.push(new Cell(x, y))
          }
        }
      }
    }

    deadEnds.forEach(cell => maze[cell.x][cell.y].makeWall());
  }
}

function drawMaze(MAZE_WIDTH, MAZE_HEIGHT) {
  const CANVAS = document.getElementById("astar-canvas");
  const CTX = CANVAS.getContext("2d");
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  
  for (let y = 0; y < MAZE_HEIGHT; y++) {
    for (let x = 0; x < MAZE_WIDTH; x++) {
      const cell = maze[x][y];
      if (!cell.isClear) {
        CTX.drawImage(cell.wallImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else {
        CTX.drawImage(cell.floorImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

const ANIMATION_DELAY = 200;
const MAX_ITERATIONS = 20;

function createMazeAnimation(WIDTH, HEIGHT) {
  let i = 0;
  const animationInterval = setInterval(() => {
    createMaze(WIDTH, HEIGHT);
    drawMaze(WIDTH, HEIGHT);
    i++;
    if (i === MAX_ITERATIONS) {
      clearInterval(animationInterval);
    }
  }, ANIMATION_DELAY);
}