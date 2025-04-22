let btn = document.querySelector("#btn");
let mono = document.querySelector("#mono");
let rainbow = document.querySelector("#rainbow");
let opacityOff = document.querySelector("#opacityOff");
let opacityOn = document.querySelector("#opacityOn");
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
    event.target.dataset.originalColor = "rgb(0, 0, 0)";
}


function rainbowColorFunction(event) {
    const newColor = randomColor();
    event.target.style.backgroundColor = newColor;
    event.target.dataset.originalColor = newColor;
}


function increaseOpacityFunction(event) {
    let element = event.target;

    let currentOpacity = parseFloat(element.dataset.opacity);
    let currentColor = window.getComputedStyle(element).backgroundColor;
    let rgbMatch = currentColor.match(/\d+/g);

    if (!element.dataset.originalColor && rgbMatch) {
        element.dataset.originalColor = `rgb(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]})`;
    }

    if (isNaN(currentOpacity)) {
        const rgbaMatch = currentColor.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/);
        currentOpacity = rgbaMatch ? parseFloat(rgbaMatch[4]) : (rgbMatch ? 1 : 0);
        element.dataset.opacity = currentOpacity ? currentOpacity.toFixed(1) : '0';
    }

    if (currentOpacity < 1) {
        currentOpacity = Math.min(1, currentOpacity + 0.1);
        element.dataset.opacity = currentOpacity.toFixed(1);

        if (element.dataset.originalColor) {
            const originalRgb = element.dataset.originalColor.match(/\d+/g);
            if (originalRgb) {
                element.style.backgroundColor = `rgba(${originalRgb[0]}, ${originalRgb[1]}, ${originalRgb[2]}, ${currentOpacity.toFixed(1)})`;
            }
        } else if (rgbMatch) {
            element.style.backgroundColor = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${currentOpacity.toFixed(1)})`;
        }
    } else {
        if (element.dataset.originalColor) {
            element.style.backgroundColor = element.dataset.originalColor;
        } else if (rgbMatch) {
            element.style.backgroundColor = `rgb(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]})`;
        }
        element.dataset.opacity = '1';
    }
}


function decreaseOpacityFunction(event) {
    let element = event.target;
    let currentColor = window.getComputedStyle(element).backgroundColor;
    let rgbaMatch = currentColor.match(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/);
    let rgbMatch = currentColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
    let currentOpacity;

    if (rgbaMatch) {
        currentOpacity = parseFloat(rgbaMatch[4]);
        let newOpacity = Math.max(0, currentOpacity - 0.1);
        element.style.backgroundColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${newOpacity.toFixed(1)})`;
        element.dataset.opacity = newOpacity.toFixed(1);
    } else if (rgbMatch) {
        element.style.backgroundColor = `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.9)`;
        element.dataset.opacity = '0.9';
    }
}


function eraserColorFunction(event) {
    event.target.style.backgroundColor = "white";
    event.target.dataset.originalColor = "white";
}


function updateGridVisibility() {
    let gridDivs = document.getElementsByClassName("gridDiv");
    for (let i = 0; i < gridDivs.length; i++) {
        if (gridVisible) {
            gridDivs[i].style.boxShadow = "0 0 0 1px rgb(97, 97, 97)";
        } else {
            gridDivs[i].style.boxShadow = "none";
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


opacityOff.addEventListener("click", () => {
    currentColorFunction = decreaseOpacityFunction;
    applyColorFunction();
})


opacityOn.addEventListener("click", () => {
    currentColorFunction = increaseOpacityFunction;
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
        paintedDivs[i].dataset.originalColor = "white";
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