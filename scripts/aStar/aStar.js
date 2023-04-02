function openAStar(evt, algorithmName) {
  var i, tabContent, tablinks;

  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }   

  document.getElementById(algorithmName).style.display = "inline-block";
  evt.currentTarget.className += " active";
}

//code
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

function createMap(width, height) {
    let map = new Array(width);
    for (let w = 0; w < width; w++) {
      map[w] = new Array(height);
      for (let h = 0; h < height; h++) {
        map[w][h] = new Cell(w, h, false);
        map[w][h].makeWall();
      }
    }

    let x = Math.floor(Math.random() * width / 2) * 2 + 1;
    let y = Math.floor(Math.random() * height / 2) * 2 + 1;
    map[x][y].clear_cell();

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