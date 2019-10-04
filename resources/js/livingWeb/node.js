"use strict";

class Node {
    constructor(canvas, xPos, yPos) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.xPos = xPos;
        this.yPos = yPos;
        this.ySpeed = Math.random()*2 - Math.random()*2;
        this.xSpeed = Math.random()*2 - Math.random()*2;
    }

    drawPoint() {
        this.ctx.beginPath();
        this.ctx.arc(this.xPos, this.yPos, 2.5, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawLines(nodes, drawRadius) {
        this.ctx.beginPath();
        for (let pos = 0; pos < nodes.length; pos++) {
            if (nodes[pos] === this) continue;

            let distance = Math.sqrt( Math.pow(nodes[pos].xPos - this.xPos, 2) + Math.pow(nodes[pos].yPos - this.yPos, 2) );

            if (distance < drawRadius) {
                let percent = -((distance - drawRadius) / drawRadius);
                this.ctx.strokeStyle = "#FFF" + Math.floor(percent*15).toString(16);
                this.ctx.moveTo(this.xPos, this.yPos);
                this.ctx.lineTo(nodes[pos].xPos, nodes[pos].yPos);
                this.ctx.stroke();
            }
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = "#FFF";
    }

    move() {
        if (this.xPos <= 0 && this.xSpeed < 0) {
            this.xSpeed *= -1;
        } else if(this.xPos >= this.canvas.width && this.xSpeed > 0) {
            this.xSpeed *= -1;
        }

        if (this.yPos <= 0 && this.ySpeed < 0) {
            this.ySpeed *= -1;
        } else if(this.yPos >= this.canvas.height && this.ySpeed > 0) {
            this.ySpeed *= -1;
        }

        this.xPos += this.xSpeed;
        this.yPos += this.ySpeed;
    }
}