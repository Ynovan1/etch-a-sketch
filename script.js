let btn = document.querySelector("#btn");
let container = document.querySelector("#container");


function randomColor() {
    let color = [];
    for (let i = 0; i < 3; i++) {
        color.push(Math.floor(Math.random() * 256));
    }
    return "rgb(" + color.join(", ") + ")";
}


function createGrid(size) {
    container.innerHTML = "";

    for (let i = 0; i < size * size; i++) {
        let gridItem = document.createElement("div");
        gridItem.className = "gridDiv";
        gridItem.style.width = `calc(600px / ${size})`;
        gridItem.style.height = `calc(600px / ${size})`;
        container.appendChild(gridItem);
    }

    let paintedDivs = document.getElementsByClassName("gridDiv");

    for (let i = 0; i < paintedDivs.length; i++) {
        paintedDivs[i].addEventListener("mouseover", () => {
            paintedDivs[i].style.backgroundColor = randomColor();
        });
    }
}


createGrid(16);


btn.addEventListener("click", () => {
    let size = parseInt(prompt("Enter the number of squares per side (1-100):"));

    if (size > 0 && size <= 100) {
        createGrid(size);
    } else {
        alert("Please, enter a valid number (1-100).");
    }
});