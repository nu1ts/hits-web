//canvas creation
window.addEventListener('load', function() {
  const divContainer = document.getElementById('astar-div');
  const newCanvas = document.createElement('canvas');
  newCanvas.setAttribute('id', 'astar-canvas');
  divContainer.appendChild(newCanvas);
});
//
//------------------------------------------
//constants
const CELL_SIZE  = 16;
const MAZE_WIDTH = 69;
const  MAZE_HEIGHT = 69;
const INTERVAL_TIME = 10;
let maze = [];
//
//------------------------------------------
//images
const WALL_IMAGE = new Image();
WALL_IMAGE.src = 'images/Wall.png';
const FLOOR_IMAGE = new Image();
FLOOR_IMAGE.src = 'images/Floor.png';
const SELECT_IMAGE = new Image();
SELECT_IMAGE.src = 'images/Select.png';
const WALL_3D = new Image();
WALL_3D.src = 'images/3DWall.png';
//
//------------------------------------------
//-------------------CODE-------------------
//classes
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
//
//------------------------------------------
//draw
function draw(x, y) {
  const CANVAS = document.getElementById("astar-canvas");
  const CTX = CANVAS.getContext("2d");

  CTX.save();
  
  if(maze[x][y] != 2) {
    if (maze[x][y] == 1) {
      CTX.drawImage(FLOOR_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      if(maze[x][y - 1] == 0) {
        CTX.drawImage(WALL_3D, x * CELL_SIZE, (y - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    } else {
      CTX.drawImage(WALL_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  else {
    CTX.drawImage(SELECT_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
  
  CTX.restore();
}
//
//------------------------------------------
//map
  function createMaze() {
    const CANVAS = document.getElementById("astar-canvas");
    CANVAS.width = CELL_SIZE * MAZE_WIDTH;
    CANVAS.height = CELL_SIZE * MAZE_HEIGHT;
    
    for (let x = 0; x < MAZE_WIDTH; x++) {
      maze[x] = new Array(MAZE_HEIGHT);
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        maze[x][y] = 0;
        draw(x, y);
      }
    }

    let x = Math.floor(Math.random() * MAZE_WIDTH / 2) * 2 + 1;
    let y = Math.floor(Math.random() * MAZE_HEIGHT / 2) * 2 + 1;
    maze[x][y] = 1;
    draw(x, y);

    let toCheck = [];
    if (y - 2 >= 0) {
      toCheck.push(new Point(x, y - 2));
      maze[x][y - 2] = 2;
    }
    if (y + 2 < MAZE_HEIGHT) {
      toCheck.push(new Point(x, y + 2));
      maze[x][y + 2] = 2;
    }
    if (x - 2 >= 0) {
      toCheck.push(new Point(x - 2, y));
      maze[x - 2][y] = 2;
    }
    if (x + 2 < MAZE_WIDTH) {
      toCheck.push(new Point(x + 2, y));
      maze[x + 2][y] = 2;
    }
    toCheck.forEach(point => draw(point.x, point.y));
    
    let interval = setInterval(() => {
      if (toCheck.length <= 0) {
        clearInterval(interval);
        return;
      }
  
      let index = Math.floor(Math.random() * toCheck.length);
      let randomPoint = toCheck[index];
      let x = randomPoint.x;
      let y = randomPoint.y;
      maze[x][y] = 1;
      toCheck.splice(index, 1);
  
      draw(x, y);
  
      connectCells(x, y, toCheck);
    }, INTERVAL_TIME);
  }

  function connectCells(x, y, toCheck) {
    let direction = ["north", "south", "east", "west"];
    while (direction.length > 0) {
      let dirIndex = Math.floor(Math.random() * direction.length);
      switch (direction[dirIndex]) {
        case "north":
          if (y - 2 >= 0 && maze[x][y - 2] == 1) {
            maze[x][y - 1] = 1;
            draw(x, y - 1);
            direction.splice(0, direction.length);
          }
        break;
        case "south":
          if (y + 2 < MAZE_HEIGHT && maze[x][y + 2] == 1) {
            maze[x][y + 1] = 1;
            draw(x, y + 1);
            direction.splice(0, direction.length);
          }
        break;
        case "east":
          if (x - 2 >= 0 && maze[x - 2][y] == 1) {
            maze[x - 1][y] = 1;
            draw(x - 1, y);
            direction.splice(0, direction.length);
          }
        break;
        case "west":
          if (x + 2 < MAZE_WIDTH && maze[x + 2][y] == 1) {
            maze[x + 1][y] = 1;
            draw(x + 1, y);
            direction.splice(0, direction.length);
          }
        break;
      }
      direction.splice(dirIndex, 1);
    }

    if (y - 2 >= 0 && maze[x][y - 2] == 0) {
      toCheck.push(new Point(x, y - 2));
      maze[x][y - 2] = 2;
    }
    if (y + 2 < MAZE_HEIGHT && maze[x][y + 2] == 0) {
      toCheck.push(new Point(x, y + 2));
      maze[x][y + 2] = 2;
    }
    if (x - 2 >= 0 && maze[x - 2][y] == 0) {
      toCheck.push(new Point(x - 2, y));
      maze[x - 2][y] = 2;
    }
    if (x + 2 < MAZE_WIDTH && maze[x + 2][y] == 0) {
      toCheck.push(new Point(x + 2, y));
      maze[x + 2][y] = 2;
    }
    toCheck.forEach(point => draw(point.x, point.y));
  }
//
//------------------------------------------
//add-ons for the map
  function deleteDeadEnds() {
    for (let i = 0; i < 4; i++) {
      let deadEnds = [];
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
          if (maze[x][y] == 1) {
            let neighbors = 0;
            if (y - 1 >= 0 && maze[x][y - 1] == 1) {
              neighbors++;
            }
            if (y + 1 < MAZE_HEIGHT && maze[x][y + 1] == 1) {
              neighbors++;
            }
            if (x - 1 >= 0 && maze[x - 1][y] == 1) {
              neighbors++;
            }
            if (x + 1 < MAZE_WIDTH && maze[x + 1][y] == 1) {
              neighbors++;
            }
            if (neighbors <= 1) {
              deadEnds.push(new Point(x, y))
            }
          }
        }
      }
      
      deadEnds.forEach(point => {
        maze[point.x][point.y] = 0;
        draw(point.x, point.y);
      });
    }
  }

  function cultivation(value) {
    for (let i = 0; i < value; i++) {
      let newCells = [];
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
          if (maze[x][y] == 0) {
            let neighbors = 0;
            for (let a = 0; a < 3; a++) {
              for (let b = 0; b < 3; b++) {
                let neighborX = x - a;
                let neighborY = y - b;
                if (neighborX >= 0 && neighborX < MAZE_WIDTH && neighborY >= 0 && neighborY < MAZE_HEIGHT) {
                  if (maze[neighborX][neighborY] == 1) {
                    neighbors++;
                  }
                }
              }
            }
            if (neighbors >= 4) {
              newCells.push(new Point(x, y));
            }
          }
        }
      }

      newCells.forEach(point => {
        maze[point.x][point.y] = 1;
        draw(point.x, point.y);
      });
    }
  }
//
//------------------------------------------
//html functions
function aStar(startPoint, endPoint) {
  let openSet = [];
  let closedSet = [];
  let cameFrom = new Map();

  let gScore = new Map();
  gScore.set(startPoint, 0);

  let fScore = new Map();
  fScore.set(startPoint, heuristic(startPoint, endPoint));

  openSet.push(startPoint);

  while (openSet.length > 0) {
    let current = null;
    let minFScore = Infinity;

    for (let i = 0; i < openSet.length; i++) {
      let point = openSet[i];
      if (fScore.get(point) < minFScore) {
        minFScore = fScore.get(point);
        current = point;
      }
    }

    if (current === endPoint) {
      let path = [current];
      while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        path.unshift(current);
      }
      return path;
    }

    openSet = openSet.filter((point) => point !== current);
    closedSet.push(current);

    let neighbors = getNeighbors(current);

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (closedSet.indexOf(neighbor) !== -1) {
        continue;
      }

      let tentativeGScore = gScore.get(current) + 1;

      if (openSet.indexOf(neighbor) === -1) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore.get(neighbor)) {
        continue;
      }

      cameFrom.set(neighbor, current);
      gScore.set(neighbor, tentativeGScore);
      fScore.set(
        neighbor,
        gScore.get(neighbor) + heuristic(neighbor, endPoint)
      );
    }
  }

  return null;
}

function heuristic(start, goal) {
  return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}  

function getNeighbors(point) {
  let result = [];

  if (point.x > 0) {
    result.push({ x: point.x - 1, y: point.y });
  }
  if (point.y > 0) {
    result.push({ x: point.x, y: point.y - 1 });
  }
  if (point.x < MAZE_WIDTH - 1) {
    result.push({ x: point.x + 1, y: point.y });
  }
  if (point.y < MAZE_HEIGHT - 1) {
    result.push({ x: point.x, y: point.y + 1 });
  }

  return result.filter((point) => maze[point.x][point.y] !== 0);
}
//------------------------------------------
//html functions
function getMaze() {
  createMaze();

  const CANVAS = document.getElementById("astar-canvas");
  const CTX = CANVAS.getContext("2d");
  for(let x = 0; x < MAZE_WIDTH; x++) {
    CTX.drawImage(WALL_3D, x * CELL_SIZE, (MAZE_HEIGHT - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
}