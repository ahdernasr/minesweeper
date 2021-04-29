//TDL
// RESET
// DIFFICULTIES

rows = 14;
cols = 18;
bombs = 25;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createGrid() {
  if (document.getElementById("homediv").children[1]) {
    document.getElementById("homediv").children[1].remove();
  }
  grid = document.createElement("div");
  grid.id = "grid";
  document.getElementById("homediv").appendChild(grid);
  for (x = 0; x < cols; x++) {
    line = document.createElement("div");
    grid.appendChild(line);
    for (y = 0; y < rows; y++) {
      el = document.createElement("div");
      el.value = {
        x: x,
        y: y,
        bomb: false,
        hidden: true,
        rightClicked: false,
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
rightClicked = false;
function eventHandler() {
  for (e of elements) {
    e.addEventListener("contextmenu", rClickHandler);

    e.addEventListener("click", lClickHandler);
  }

  document.getElementById("reset").addEventListener("click", reset);
}

var myInterval = () => {};
function reset() {
  clearInterval(myInterval);
  stopwatch.textContent = "";
  firstTime = true;
  recur = false;
  createGrid();
}

function rClickHandler(event) {
  event.preventDefault();
  if (
    !event.target.closest(".el").rightClicked &&
    event.target.closest(".el").classList.contains("hidden")
  ) {
    event.target.closest(".el").classList.add("marked");
    event.target.closest(".el").rightClicked = true;
  } else if (
    event.target.closest(".el").rightClicked &&
    event.target.closest(".el").classList.contains("hidden")
  ) {
    event.target.closest(".el").classList.remove("marked");
    event.target.closest(".el").rightClicked = false;
  }
}

stopwatch = document.getElementById("stopwatch");
firstTime = true;
function lClickHandler(event) {
  if (event.target.closest(".el").classList.contains("marked")) return;
  reveal(event.target.closest(".el"));
  if (checkWin()) {
    lock();
    resultMessage("Win");
  }
  if (firstTime) {
    value = 0;
    myInterval = setInterval(() => {
      value += 1;
      stopwatch.textContent = `${value}s`;
    }, 1000);
  }
  firstTime = false;
}

async function reveal(el) {
  if (el.value.bomb) {
    lock();
    el.classList.add("bomb");
    for (e of elements) {
      if (recur) {
        if (e.value.bomb) {
          e.classList.remove("hidden");
          e.classList.add("bomb");
          await sleep(250);
        }
      }
    }
    if (recur) {
      resultMessage("Lose");
    }
    return;
  } else {
    el.classList.remove("hidden");
    el.value.hidden = false;
  }

  adj = findAdjacents(el);
  if (findBombCount(findAdjacents(el)) != 0) {
    el.textContent = findBombCount(adj);
    if (el.textContent == 1) {
      el.style.color = "blue";
    } else if (el.textContent == 2) {
      el.style.color = "green";
    } else if (el.textContent == 3) {
      el.style.color = "red";
    } else if (el.textContent == 4) {
      el.style.color = "orange";
    } else if (el.textContent == 5) {
      el.style.color = "darkred";
    } else if (el.textContent == 6) {
      el.style.color = "purple";
    } else if (el.textContent == 7) {
      el.style.color = "black";
    } else if (el.textContent == 8) {
      el.style.color = "gray";
    }
    return;
  }
  
  recur = true;
  flood(el);
}

function flood(el) {
  adj = findAdjacents(el);
  for (a of adj) {
    if (a) {
      if (!a.value.bomb && a.classList.contains("hidden")) {
        reveal(a);
      }
    }
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
    if (e) {
      if (e.value.x == x && e.value.y == y) {
        return e;
      }
    }
  }
}

Array.prototype.remove = function () {
  var w,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    w = a[--L];
    while ((ax = this.indexOf(w)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

function findAdjacents(current) {
  if (current) {
    left = findEl(current.value.x - 1, current.value.y + 0);
    right = findEl(current.value.x + 1, current.value.y + 0);
    bottom = findEl(current.value.x + 0, current.value.y + 1);
    above = findEl(current.value.x + 0, current.value.y - 1);
    topright = findEl(current.value.x + 1, current.value.y - 1);
    topleft = findEl(current.value.x - 1, current.value.y - 1);
    bottomright = findEl(current.value.x + 1, current.value.y + 1);
    bottomleft = findEl(current.value.x - 1, current.value.y + 1);
  }
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
    if (a && a.value) {
      if (a.value.bomb) {
        bombCount += 1;
      }
    }
  }
  return bombCount;
}

function checkWin() {
  explored = 0;
  for (e of elements) {
    if (!e.value.hidden && !e.classList.contains("marked")) {
      explored += 1;
      if (explored == rows * cols - bombs) {
        return true;
      }
    }
  }
  return false;
}

function lock() {
  for (e of elements) {
    e.removeEventListener("click", lClickHandler);
    e.removeEventListener("contextmenu", rClickHandler);
  }
  clearInterval(myInterval);
  return;
}

createGrid();

function resultMessage(result) {
  for (e of elements) {
    e.classList.add("fadein");
  }

  message = document.createElement("h1");
  message.textContent = `You ${result}! Time: ${stopwatch.textContent}`;
  message.classList.add("resultGrid");
  grid.appendChild(message);
}
