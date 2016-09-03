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
        let progForm = document.getElementById("program");
        let currProgram = document.getElementById("current-program");
        let programList = ["15PUZZLE", "BLINKY", "BLITZ", "BRIX", "CONNECT4", "GUESS", "HIDDEN", "IBM", "INVADERS", "KALEID", "MAZE", "MERLIN", "MISSILE", "PONG", "PONG2", "PUZZLE", "SYZYGY", "TANK", "TETRIS", "TICTAC", "UFO", "VBRIX", "VERS", "WIPEOFF"];

        for (let p of programList) {
            let option = document.createElement("option");
            option.textContent = p;
            progForm.add(option);
        }

        let self = this;
        progForm.addEventListener('change', function(e) {
            let val = progForm.value;

            if (!val) {
                alert("Please select a ROM to play");
                return;
            }

            let xhr = new XMLHttpRequest;
            xhr.open("GET", "roms/" + val, true);
            xhr.responseType = "arraybuffer";

            xhr.onload = () => {
                self.chip8.stop();
                self.chip8.reset();
                self.chip8.loadProgram(new Uint8Array(xhr.response));
                self.chip8.start();

                currProgram.textContent = val;
            };

            xhr.send();
            this.blur();
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

    fullscreenFormSetup() {
        let launchFullScreen = (this.canvas.requestFullScreen ||
        this.canvas.mozRequestFullScreen ||
        this.canvas.webkitRequestFullScreen).bind(this.canvas, Element.ALLOW_KEYBOARD_INPUT);

        let makeEvent = function(prefix) {
            return "on" + prefix + "fullscreenchange";
        };

        let fullScreenEvent = ["", "webkit", "moz"].filter(function(prefix) {
            return document.hasOwnProperty(makeEvent(prefix));
        }).map(function(prefix) { return makeEvent(prefix); })[0];

        let getFullScreenElement = function () {
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

            let width = screen.width;
            let height = screen.height;

            let chWidth = this.canvas.getDisplayWidth();
            let chHeight = this.canvas.getDisplayHeight();

            let cellsWidth = Math.floor(width / chWidth) - 1;
            let cellsHeight = Math.floor(height / chHeight) - 1;

            let cellSize = Math.min(cellsWidth, cellsHeight);

            this.renderer.setCellSize(cellSize);
        };
    }

    keyHandlers() {
        let translateKeys = {
            49: 0x1,  // 1
            50: 0x2,  // 2
            51: 0x3,  // 3
            52: 0x4,  // 4
            81: 0x5,  // Q
            87: 0x6,  // W
            69: 0x7,  // E
            82: 0x8,  // R
            65: 0x9,  // A
            83: 0xA,  // S
            68: 0xB,  // D
            70: 0xC,  // F
            90: 0xD,  // Z
            88: 0xE,  // X
            67: 0xF,  // C
            86: 0x10  // V
        };

        document.addEventListener("keydown", (e) => {
            this.chip8.setKey(translateKeys[e.keyCode]);
        });

        document.addEventListener("keyup", (e) => {
            this.chip8.unsetKey(translateKeys[e.keyCode]);
        });
    }

    fpsManager() {
        let fps = document.getElementById("fps");
        setInterval(() => {
            fps.textContent = this.renderer.getFPS().toPrecision(3);
        }, 1e3);
    }
}
