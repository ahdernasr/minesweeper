grid = document.getElementById("grid");
rows = 14;
cols = 18;
bombs = 20;

function createGrid() {
  for (x = 0; x < cols; x++) {
    line = document.createElement("div");
    grid.appendChild(line);
    for (y = 0; y < rows; y++) {
      el = document.createElement("div");
      el.value = {
        x: x,
        y: y,
        bomb: false,
      };
      el.classList.add("el");
      el.classList.add("hidden");
      line.appendChild(el);
    }
  }
  elements = document.getElementsByClassName("el");
  bombsArr = getRandom(elements, bombs);
  bomb = document.createElement("div");
  bomb.classList.add("bomb");
  for (e of bombsArr) {
    e.value.bomb = true;
  }
  eventHandler();
}

elements = document.getElementsByClassName("el");

function eventHandler() {
  for (e of elements) {
    e.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.target.closest(".el").classList.add("marked");
    });

    e.addEventListener("click", (event) => {
      //CHECK BOMB

      if (event.target.closest(".el").value.bomb) {
        for (e of elements) {
          if (e.value.bomb) {
            e.classList.remove("hidden");
            e.classList.add("bomb");
          }
        }
      } else {
        event.target.closest(".el").classList.remove("hidden");
      }

      //FIND ADJACENTS
      if (!event.target.closest(".el").classList.contains("bomb")) {
        if (findBombCount(findAdjacents(event.target.closest(".el"))) != 0) {
          event.target.closest(".el").textContent = findBombCount(
            findAdjacents(event.target.closest(".el"))
          );
        } else {
          explode(event.target.closest(".el"));
        }
      }
    });
  }
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function findEl(x, y) {
  for (e of elements) {
    if (e.value.x == x && e.value.y == y) {
      return e;
    }
  }
}

function findAdjacents(current) {
  left = findEl(current.value.x - 1, current.value.y + 0);
  right = findEl(current.value.x + 1, current.value.y + 0);
  bottom = findEl(current.value.x + 0, current.value.y + 1);
  above = findEl(current.value.x + 0, current.value.y - 1);
  topright = findEl(current.value.x + 1, current.value.y - 1);
  topleft = findEl(current.value.x - 1, current.value.y - 1);
  bottomright = findEl(current.value.x + 1, current.value.y + 1);
  bottomleft = findEl(current.value.x - 1, current.value.y + 1);
  adjacents = [
    left,
    right,
    bottom,
    above,
    topright,
    topleft,
    bottomright,
    bottomleft,
  ];
  return adjacents;
}

function findBombCount(adjacents) {
  bombCount = 0;
  for (a of adjacents) {
    if (a.value) {
      if (a.value.bomb) {
        bombCount += 1;
      }
    }
  }
  return bombCount;
}

function explode(start) {
  explodingArr = [];
  startAdjacents = findAdjacents(start);
  explodingArr.push(startAdjacents);
//   while (explodingArr) {
    for (ex of explodingArr) {
      bombCount = 0;
      console.log(ex.value)
    //   newAdj = findAdjacents(ex);
    //   for (a of newAdj) {
    //     if (a.value.bomb) {
    //       bombCount += 1;
    //     } else {
    //       a.classList.remove("hidden");
    //     }
    //     if (bombCount == 0) {
    //       explodingArr.push(newAdj);
    //     }
    //  }
    // }
  } 
}

createGrid();
