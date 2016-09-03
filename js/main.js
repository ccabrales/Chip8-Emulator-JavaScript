/**
 * Created by Casey on 8/15/16.
 */

class Main {
    constructor() {
        this.canvas = document.getElementById("canvas");

        this.chip8 = new Chip8();
        this.renderer = new Renderer(this.canvas, this.chip8.displayWidth, this.chip8.displayHeight, CELL_SIZE);

        this.chip8.setRenderer(this.renderer);
    }

    start() {
        this.setupForms();
        this.keyHandlers();
        this.fpsManager();
    }

    setupForms() {
        this.programFormSetup();
        this.colorFormSetup();
        this.gamepadSupport();
        this.fullscreenFormSetup();
    }

    programFormSetup() {
        this.progForm = document.getElementById("program");
        this.currProgram = document.getElementById("current-program");
        this.programList = ["15PUZZLE", "BLINKY", "BLITZ", "BRIX", "CONNECT4", "GUESS", "HIDDEN", "IBM", "INVADERS", "KALEID", "MAZE", "MERLIN", "MISSILE", "PONG", "PONG2", "PUZZLE", "SYZYGY", "TANK", "TETRIS", "TICTAC", "UFO", "VBRIX", "VERS", "WIPEOFF"];

        for (let p of this.programList) {
            let option = document.createElement("option");
            option.textContent = p;
            this.progForm.add(option);
        }

        this.progForm.addEventListener('change', (e) => {
            let val = this.progForm.value;

            if (!val) {
                alert("Please select a ROM to play");
                return;
            }

            let xhr = new XMLHttpRequest;
            xhr.open("GET", "roms/" + val, true);
            xhr.responseType = "arraybuffer";

            xhr.onload = () => {
                this.chip8.stop();
                this.chip8.reset();
                this.chip8.loadProgram(new Uint8Array(xhr.response));
                this.chip8.start();

                this.currProgram.textContent = val;
            };

            xhr.send();
            e.blur();//TODO - yes?
        });
    }

    colorFormSetup() {
        this.colorSelector = document.getElementById("color");
        this.colorSelector.addEventListener("change", (e) => {
            this.chip8.renderer.setFgColor(this.colorSelector.value);
        });
    }

    //TODO
    gamepadSupport() {

    }

    //TODO
    fullscreenFormSetup() {
        let launchFullScreen = (this.canvas.requestFullScreen ||
        this.canvas.mozRequestFullScreen ||
        this.canvas.webkitRequestFullScreen).bind(this.canvas, Element.ALLOW_KEYBOARD_INPUT);

        let makeEvent = function(prefix) {
            return "on" + prefix + "fullscreenchange";
        };

        var fullScreenEvent = ["", "webkit", "moz"].filter(function(prefix) {
            return document.hasOwnProperty(makeEvent(prefix));
        }).map(function(prefix) { return makeEvent(prefix); })[0];

        var getFullScreenElement = function () {
            return document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullscreenElement;
        };
        document.querySelector("#fullscreen").addEventListener("click", function() {
            if ( ! launchFullScreen) {
                alert("Full screen not supported.");
            } else {
                launchFullScreen();
            }
        });

        document[fullScreenEvent] = function() {
            if ( ! getFullScreenElement()) {
                this.renderer.setCellSize(CELL_SIZE);
                return;
            }

            var width = screen.width;
            var height = screen.height;

            var chWidth = this.canvas.getDisplayWidth();
            var chHeight = this.canvas.getDisplayHeight();

            var cellsWidth = Math.floor(width / chWidth) - 1;
            var cellsHeight = Math.floor(height / chHeight) - 1;

            var cellSize = Math.min(cellsWidth, cellsHeight);

            this.renderer.setCellSize(cellSize);
        };
    }

    //TODO
    keyHandlers() {

    }

    //TODO
    fpsManager() {

    }
}
