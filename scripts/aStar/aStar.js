//constants
const CANVAS = document.getElementById("astar-canvas");
const CTX = CANVAS.getContext("2d");
const CELL_SIZE  = 16;
const MAZE_WIDTH = 139;
const MAZE_HEIGHT = 61;
const INTERVAL_TIME = 5;
let START_POINT = null;
let END_POINT = null;
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
const START_IMAGE = new Image();
START_IMAGE.src = 'images/Start.png';
const START_3D = new Image();
START_3D.src = 'images/3DStart.png';
const MOUSEOVER_FLOOR = new Image();
MOUSEOVER_FLOOR.src = 'images/MouseoverFloorImage.png';
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
  CTX.save();
  
  if(maze[x][y] != 2) {
    if (maze[x][y] == 1) {
      CTX.drawImage(FLOOR_IMAGE, x * CELL_SIZE, 
        y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      if(maze[x][y - 1] == 0) {
        CTX.drawImage(WALL_3D, x * CELL_SIZE, 
          (y - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    } else {
      CTX.drawImage(WALL_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  else {
    CTX.drawImage(SELECT_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  if (maze[x][y] == 3) {
    if(maze[x][y + 1] == 1) {
      CTX.drawImage(PATH_3D, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    else {
      CTX.drawImage(PATH_IMAGE, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  
  CTX.restore();
}
//
//------------------------------------------
//map
  function createMaze() {
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
    if (x >= 0 && x < MAZE_WIDTH && y >= 0 && y < MAZE_HEIGHT) {
      maze[x][y] = 1;
    }
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
                if (neighborX >= 0 && neighborX < MAZE_WIDTH &&
                   neighborY >= 0 && neighborY < MAZE_HEIGHT) {
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
//A* algorithm
function heuristic(start, goal) {
  return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}

function getNeighbors(point) {
  const neighbors = [];
  if (maze[point.x - 1]?.[point.y] === 1) neighbors.push(new Point(point.x - 1, point.y));
  if (maze[point.x + 1]?.[point.y] === 1) neighbors.push(new Point(point.x + 1, point.y));
  if (maze[point.x]?.[point.y - 1] === 1) neighbors.push(new Point(point.x, point.y - 1));
  if (maze[point.x]?.[point.y + 1] === 1) neighbors.push(new Point(point.x, point.y + 1));
  return neighbors;
}

function aStar() {
  const openPoints = [new Point(START_POINT.x, START_POINT.y)];
  const closedPoints = [];

  const gCost = [[new Point(START_POINT.x, START_POINT.y), 0]];
  const fCost = [[new Point(START_POINT.x, START_POINT.y), heuristic(START_POINT, END_POINT)]];

  const cameFrom = [];

  let currentPoint;
  while (openPoints.length > 0) {
    let minFCost = Infinity;
    for (let i = 0; i < openPoints.length; i++) {
      const pointFCost = fCost.find((point) => point[0].x === openPoints[i].x && point[0].y === openPoints[i].y)[1];
      if (pointFCost < minFCost) {
        currentPoint = openPoints[i];
        minFCost = pointFCost;
      }
    }

    if (currentPoint.x === END_POINT.x && currentPoint.y === END_POINT.y) {
      const path = [END_POINT];
      while (path[0].x !== START_POINT.x || path[0].y !== START_POINT.y) {
        path.unshift(cameFrom.find((point) => point[0].x === path[0].x && point[0].y === path[0].y)[1]);
      }
      return path;
    }

    openPoints.splice(openPoints.indexOf(currentPoint), 1);
    closedPoints.push(currentPoint);

    for (let neighbor of getNeighbors(currentPoint)) {
      if (closedPoints.find((point) => point.x === neighbor.x && point.y === neighbor.y)) {
        continue;
      }

      const neighborGCostIndex = gCost.findIndex((point) => point[0].x === neighbor.x && point[0].y === neighbor.y);
      const tentativeGCost = gCost.find((point) => point[0].x === currentPoint.x && point[0].y === currentPoint.y)[1] + 1;

      if (neighborGCostIndex === -1) {
        openPoints.push(neighbor);
        gCost.push([neighbor, tentativeGCost]);
      } else if (tentativeGCost >= gCost[neighborGCostIndex][1]) {
        continue;
      }

      cameFrom.push([neighbor, currentPoint]);
      if (neighborGCostIndex === -1) {
        fCost.push([neighbor, tentativeGCost + heuristic(neighbor, END_POINT)]);
      } else {
        fCost[neighborGCostIndex][1] = tentativeGCost + heuristic(neighbor, END_POINT);
      }
    }
  }

  return null;
}

//------------------------------------------
//cell select animation
let lastPoint = null;
CANVAS.addEventListener('mousemove', (event) => {
  const rect = CANVAS.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const mazeX = Math.floor(mouseX / CELL_SIZE);
  const mazeY = Math.floor(mouseY / CELL_SIZE);
    
  if(START_POINT == undefined) {
    if (maze[mazeX] && maze[mazeX][mazeY]) {
      if(maze[mazeX][mazeY] == 1) {
        if(lastPoint != undefined) {
          if(mazeX != lastPoint.x || mazeY != lastPoint.y) {
            CTX.drawImage(FLOOR_IMAGE, lastPoint.x * CELL_SIZE, lastPoint.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            CTX.drawImage(MOUSEOVER_FLOOR, mazeX * CELL_SIZE, mazeY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
        lastPoint = new Point(mazeX, mazeY);
      }
    }
  }
  else if(END_POINT == undefined) {
    if (maze[mazeX] && maze[mazeX][mazeY]) {
      if(maze[mazeX][mazeY] == 1) {
        if(lastPoint != undefined) {
          if((mazeX != lastPoint.x || mazeY != lastPoint.y) && (START_POINT.x != lastPoint.x || START_POINT.y != lastPoint.y)) {
            CTX.drawImage(FLOOR_IMAGE, lastPoint.x * CELL_SIZE, lastPoint.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            CTX.drawImage(MOUSEOVER_FLOOR, mazeX * CELL_SIZE, mazeY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
        lastPoint = new Point(mazeX, mazeY);
      }
    }
  }
});

CANVAS.addEventListener('mouseleave', () => {
  if(START_POINT == undefined) {
    CTX.clearRect(lastPoint.x * CELL_SIZE, lastPoint.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    lastPoint = undefined;
  }
});

function createLinePath(startX, startY, endX, endY) {
  const centerStartX = startX + 0.5;
  const centerStartY = startY + 0.5;
  const centerEndX = endX + 0.5;
  const centerEndY = endY + 0.5;
  
  CTX.beginPath();
  CTX.moveTo(centerStartX * CELL_SIZE, centerStartY * CELL_SIZE);
  CTX.lineTo(centerEndX * CELL_SIZE, centerEndY * CELL_SIZE);
  CTX.lineWidth = CELL_SIZE / 3.5;
  CTX.lineCap = 'round';
  CTX.strokeStyle = '#38905c'
  CTX.stroke();
}

let lastPath = [];

CANVAS.addEventListener('click', (event) => {
  const rect = CANVAS.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const mazeX = Math.floor(mouseX / CELL_SIZE);
  const mazeY = Math.floor(mouseY / CELL_SIZE);

  let newPath;
  
  if (maze[mazeX] && maze[mazeX][mazeY] && maze[mazeX][mazeY] == 1) {
    if(START_POINT == undefined) {
      START_POINT = new Point(mazeX, mazeY);
      CTX.drawImage(START_3D, START_POINT.x * CELL_SIZE, START_POINT.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    else {
      END_POINT = new Point(mazeX, mazeY);
      newPath = aStar();
      let currentIndex = 0;
      let interval = setInterval(() => {
        if (currentIndex >= newPath.length - 1) {
          clearInterval(interval);
          return;
        }

        if (currentIndex == 0) {
          createLinePath(newPath[currentIndex].x, newPath[currentIndex].y, newPath[currentIndex+1].x, newPath[currentIndex+1].y);
          CTX.drawImage(START_3D, START_POINT.x * CELL_SIZE, START_POINT.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else {
          CTX.drawImage(FLOOR_IMAGE, END_POINT.x * CELL_SIZE, END_POINT.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          createLinePath(newPath[currentIndex].x, newPath[currentIndex].y, newPath[currentIndex+1].x, newPath[currentIndex+1].y);
        }

        currentIndex++;
      }, INTERVAL_TIME);
      if (END_POINT != undefined) {
        if (lastPath.length > 0) {
          CTX.drawImage(FLOOR_IMAGE, lastPath[lastPath.length - 1].x * CELL_SIZE, lastPath[lastPath.length - 1].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        for (let i = 0; i < lastPath.length - 1; i++) {
          CTX.drawImage(FLOOR_IMAGE, lastPath[i].x * CELL_SIZE, lastPath[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        lastPath = newPath;
        CTX.drawImage(START_3D, START_POINT.x * CELL_SIZE, START_POINT.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      
    }
  }
});

//
//------------------------------------------
//run code
function getMaze() {
  START_POINT = null;
  END_POINT = null;
  lastPoint = null;
  createMaze();
  for(let x = 0; x < MAZE_WIDTH; x++) {
    CTX.drawImage(WALL_3D, x * CELL_SIZE, (MAZE_HEIGHT - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
}
//