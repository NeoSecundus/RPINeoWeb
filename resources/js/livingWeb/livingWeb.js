"use strict";

let radius = 240;
let density = 60;

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "#FFF";
ctx.strokeStyle = "#FFF";

let nodes = [];
nodeGen();

function nodeGen() {
    nodes = [];
    let nodeNum = Math.ceil(canvas.width / density);
    for (let i = 0; i < nodeNum; i++) {
        nodes.push(new Node(canvas, Math.random() * canvas.width, Math.random() * canvas.height));
    }
    console.log(nodes.length);
}

const livingWebLoop = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let pos = 0; pos < nodes.length; pos++) {
        nodes[pos].drawPoint();
        nodes[pos].drawLines(nodes, radius);
    }
    for (let pos = 0; pos < nodes.length; pos++) {
        nodes[pos].move();
    }

}, 50);

let oldWidth = window.innerWidth;
const widthLimit = 1080;
window.onresize = () => {
    if (Math.abs(oldWidth - window.innerWidth) > 24) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        nodeGen();

        if (window.innerWidth < widthLimit && oldWidth > widthLimit) {
            console.log("stopped...");
            clearInterval(livingWebLoop);
        } else if (oldWidth < widthLimit) {
            console.log("restarted...");
            setInterval(livingWebLoop);
        }

        oldWidth = window.innerWidth;
    }
};



