const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clear-btn");
const predictBtn = document.getElementById("predict-btn");
const predictionElement = document.getElementById("prediction");

let drawing = false;
let lastX, lastY;

canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
    if (drawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        lastX = e.offsetX;
        lastY = e.offsetY;
    }
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
});

clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    predictionElement.textContent = "";
});

predictBtn.addEventListener("click", () => {
    const pixelData = getPixelData();
    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pixel_data: pixelData })
    })
    .then(response => response.json())
    .then(data => {
        predictionElement.textContent = `Prediction: ${data.prediction} (${data.probability})`;
    })
    .catch(error => {
        console.error(error);
    });
});

function getPixelData() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
        pixelData.push(imageData.data[i] / 255);
    }
    return pixelData;
}