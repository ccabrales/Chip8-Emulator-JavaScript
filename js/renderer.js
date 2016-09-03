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
        if (this.audioCtx) {
            let oscillatorNode = this.audioCtx.createOscillator();
            oscillatorNode.start(0);
            setTimeout(function() {
                oscillatorNode.stop(0);
            }, 100);
            return;
        }

        let timesRun = 5;
        let interval = setInterval(function(canvas) {
           if (timesRun < 0) {
               clearInterval(interval);
           }

           timesRun--;
            canvas.style.right = timesRun % 2 === 0 ? "3px" : "-3px";
        }, 50, this.canvas);
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