let btn = document.querySelector("#btn");
let mono = document.querySelector("#mono");
let rainbow = document.querySelector("#rainbow");
let container = document.querySelector("#container");
let eraser = document.querySelector("#eraser");
let eraseAll = document.querySelector("#eraseAll");
let gridView = document.querySelector("#gridView");

let currentSize = 16;
let currentColorFunction = monoColorFunction;
let isMouseDown = false;
let lastColoredDiv = null;
let gridVisible = false;


function randomColor() {
    let color = [];
    for (let i = 0; i < 3; i++) {
        color.push(Math.floor(Math.random() * 256));
    }
    return "rgb(" + color.join(", ") + ")";
};


function createGrid(size) {
    container.innerHTML = "";

    for (let i = 0; i < size * size; i++) {
        let gridItem = document.createElement("div");
        gridItem.className = "gridDiv";
        gridItem.style.width = `calc(600px / ${size})`;
        gridItem.style.height = `calc(600px / ${size})`;
        container.appendChild(gridItem);
    }
    currentSize = size;
    applyColorFunction();
    updateGridVisibility();
}

function removeEventListeners() {
    let paintedDivs = document.getElementsByClassName("gridDiv");
    for (let i = 0; i < paintedDivs.length; i++) {
        paintedDivs[i].removeEventListener("mousemove", colorDiv);
    }
}

function applyColorFunction() {
    removeEventListeners();
    let paintedDivs = document.getElementsByClassName("gridDiv");
    if (currentColorFunction) {
        for (let i = 0; i < paintedDivs.length; i++) {
            paintedDivs[i].addEventListener("mousemove", colorDiv);
        }
    }
}

function colorDiv(event) {
    if (isMouseDown && event.target !== lastColoredDiv) {
        currentColorFunction(event);
        lastColoredDiv = event.target;
    }
}

function monoColorFunction(event) {
    event.target.style.backgroundColor = "rgb(0, 0, 0)";
}

function rainbowColorFunction(event) {
    event.target.style.backgroundColor = randomColor();
}

function eraserColorFunction(event) {
    event.target.style.backgroundColor = "white";
}

function updateGridVisibility() {
    let gridDivs = document.getElementsByClassName("gridDiv");
    for (let i = 0; i < gridDivs.length; i++) {
        if (gridVisible) {
            gridDivs[i].style.border = "solid 1px rgb(97, 97, 97)";
        } else {
            gridDivs[i].style.border = "none";
        }
    }
    gridView.textContent = gridVisible ? "Hide grid" : "Show grid";
}

btn.addEventListener("click", () => {
    let size = parseInt(prompt("Enter the number of squares per side (1-100):"));
    if (size > 0 && size <= 100) {
        createGrid(size);
    } else {
        alert("Please, enter a valid number (1-100).");
    }
});


mono.addEventListener("click", () => {
    currentColorFunction = monoColorFunction;
    applyColorFunction();
});


rainbow.addEventListener("click", () => {
    currentColorFunction = rainbowColorFunction;
    applyColorFunction();
});


eraser.addEventListener("click", () => {
    currentColorFunction = eraserColorFunction;
    applyColorFunction();
});


eraseAll.addEventListener("click", () => {
    let paintedDivs = document.getElementsByClassName("gridDiv");
    for (let i = 0; i < paintedDivs.length; i++) {
        paintedDivs[i].style.backgroundColor = "white";
    }
});

container.addEventListener("mousedown", (event) => {
    event.preventDefault();
    isMouseDown = true;
    lastColoredDiv = null;
});

container.addEventListener("mouseup", () => {
    isMouseDown = false;
    lastColoredDiv = null;
});

gridView.addEventListener("click", () => {
    gridVisible = !gridVisible;
    updateGridVisibility();
});


createGrid(16);