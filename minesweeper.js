//TDL
// DETETCING WIN
// RESET 
// DIFFICULTIES

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
        hidden: true,
        rightClicked: false
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
  eventHandler(false);
}

elements = document.getElementsByClassName("el");
rightClicked = false;
function eventHandler(lost) {
  if (!lost) {
    for (e of elements) {
      e.addEventListener("contextmenu", rClickHandler);

      e.addEventListener("click", lClickHandler);
    }
  }
}

/////////////////////////STOP WATCH////////////////////

function rClickHandler(event) {
  event.preventDefault();
  if (!event.target.closest(".el").rightClicked && event.target.closest(".el").classList.contains('hidden')) {
    event.target.closest(".el").classList.add("marked");
    event.target.closest(".el").rightClicked = true;
  } else if (event.target.closest(".el").rightClicked && event.target.closest(".el").classList.contains('hidden')) {
    event.target.closest(".el").classList.remove("marked");
    event.target.closest(".el").rightClicked = false;
  }
}

stopwatch = document.getElementById("stopwatch");
firstTime = true;
function lClickHandler(event) {
  reveal(event.target.closest(".el"));
  if (checkWin()) alert("You win!");
  if (firstTime) {
    value = 0
    myInterval = setInterval(() => {
      value+=1
      stopwatch.textContent = `${value} s`
    }, 1000)
  }
  firstTime = false;
}

function reveal(el) {
  if (el.value.bomb) {
    for (e of elements) {
      if (e.value.bomb) {
        e.classList.remove("hidden");
        e.classList.add("bomb");
      }
    }
    lock();
    return;
  } else {
    el.classList.remove("hidden");
    el.value.hidden = false;
  }

  adj = findAdjacents(el);
  if (findBombCount(findAdjacents(el)) != 0) {
    el.textContent = findBombCount(adj);
    return;
  }

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
  for (e of elements) {
    if (e.value.hidden || e.value.bomb) {
      return false;
    }
  }
  return true;
}

function lock() {
  console.log("locking");
  for (e of elements) {
    e.removeEventListener("click", lClickHandler);
    e.removeEventListener("contextmenu", rClickHandler);
    clearInterval(myInterval)
  }
}

createGrid();


