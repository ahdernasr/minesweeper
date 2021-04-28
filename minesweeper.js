grid = document.getElementById("grid")
rows = 14
cols = 18
bombs = 20

function createGrid() {
    for (x = 0; x < cols; x++) {
        line = document.createElement("div");
        grid.appendChild(line);
        for (y = 0; y < rows; y++) {
            el = document.createElement("div")
            el.value = {
                x: x,
                y: y,
                bomb: false
            }
            el.classList.add('el')
            el.classList.add("hidden")
            line.appendChild(el)
        }
    }
    elements = document.getElementsByClassName("el")
    bombsArr = getRandom(elements, bombs)
    bomb = document.createElement('div')
    bomb.classList.add("bomb")
    for (e of bombsArr) {
        e.value.bomb = true;
    }
    eventHandler()
}

elements = document.getElementsByClassName("el")
function eventHandler() {
    for (e of elements) {
        e.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            event.target.closest(".el").classList.add("marked")
        })

        e.addEventListener("click", (event) => {
            event.target.closest(".el").classList.remove("hidden")
        })
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

createGrid()