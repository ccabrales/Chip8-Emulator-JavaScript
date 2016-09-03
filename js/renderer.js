/**
 * Created by Casey on 8/13/16.
 */

class Renderer {
    constructor(canvas, width, height, cellSize, fgColor = "#0F0", bgColor = "transparent") {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;

        this.prevRender = [];
        this.prevDraw = 0;
        this.toDraws = 0;

        this.fgColor = fgColor;
        this.bgColor = bgColor;

        this.setCellSize(cellSize);

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width * this.cellSize, this.height * this.cellSize);
    }

    render(display) {
        this.clear();
        this.prevRender = display;

        for (let i = 0; i < display.length; i++) {
            let newX = (i % this.width) * this.cellSize;
            let newY = Math.floor(i / this.width) * this.cellSize;;

            //TODO - what exactly does this do?
            this.ctx.fillStyle = [this.bgColor, this.fgColor][display[i]];
            this.ctx.fillRect(newX, newY, this.cellSize, this.cellSize);
        }

        this.toDraws++;
    }

    // Play a sound or shake the screen if audio isn't supported
    beep() {
        let sound = document.getElementById("blip");
        sound.play();
    }

    setCellSize(cellSize) {
        this.cellSize = cellSize;

        this.canvas.height = this.height * this.cellSize;
        this.canvas.width = this.width * this.cellSize;

        this.render(this.prevRender);
    }

    setFgColor(fgColor) {
        this.fgColor = fgColor;
    }

    getFPS() {
        let fps = this.toDraws / (+new Date - this.prevDraw) * 1000;
        if (fps === Infinity) {
            return 0;
        }
        this.toDraws = 0;
        this.prevDraw = +new Date;
        return fps;
    }
}