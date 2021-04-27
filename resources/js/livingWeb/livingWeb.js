"use strict";

let lwRadius = 240;
let lwDensity = 60;

const lwCanvas = document.getElementById("bgCanvas");
const lwCtx = lwCanvas.getContext("2d");
lwCanvas.width = window.innerWidth;
lwCanvas.height = window.innerHeight;
lwCtx.fillStyle = "#FFF";
lwCtx.strokeStyle = "#FFF";

let lwNodes = [];
lwNodeGen();
let lwPlaying = true;
lwUpdateHtml();

function lwNodeGen() {
    lwNodes = [];
    let nodeNum = Math.ceil(lwCanvas.width / lwDensity);
    for (let i = 0; i < nodeNum; i++) {
        lwNodes.push(new Node(lwCanvas, Math.random() * lwCanvas.width, Math.random() * lwCanvas.height));
    }
}

let lwLoop = setInterval(lwStartLoop, 50);
function lwStartLoop() {
    lwCtx.clearRect(0, 0, lwCanvas.width, lwCanvas.height);

    for (let pos = 0; pos < lwNodes.length; pos++) {
        lwNodes[pos].drawPoint();
        lwNodes[pos].drawLines(lwNodes, lwRadius);
    }
    for (let pos = 0; pos < lwNodes.length; pos++) {
        lwNodes[pos].move();
    }
};

let lwOldWidth = window.innerWidth;
const widthLimit = 1080;
window.onresize = () => {
    if (Math.abs(lwOldWidth - window.innerWidth) > 24) {
        lwCanvas.width = window.innerWidth;
        lwCanvas.height = window.innerHeight;
        lwNodeGen();

        if (window.innerWidth < widthLimit && lwOldWidth > widthLimit) {
            clearInterval(lwLoop);
            lwUpdateHtml();
        } else if (window.innerWidth > widthLimit && lwOldWidth < widthLimit && lwPlaying) {
            lwLoop = setInterval(lwStartLoop, 50);
            lwUpdateHtml();
        }

        lwOldWidth = window.innerWidth;
    }
};

function lwUpdateHtml() {
    let playImg = document.getElementById("lwPlay");
    let pauseImg = document.getElementById("lwPause");
    if (lwPlaying) {
        playImg.style.display = "none";
        pauseImg.style.display = "inline";
    } else {
        playImg.style.display = "inline";
        pauseImg.style.display = "none";
    }
}

function toggleLivingWeb() {
    if (lwPlaying) {
        clearInterval(lwLoop);
        lwPlaying = false;
    } else {
        lwLoop = setInterval(lwStartLoop, 50);
        lwPlaying = true;
    }
    lwUpdateHtml();
}

