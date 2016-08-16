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
        this.colorSelector.addEventListener((e) => {
            this.chip8.renderer.setFgColor(this.colorSelector.value);
        });
    }

    gamepadSupport() {
        
    }

    fullscreenFormSetup() {

    }

    keyHandlers() {

    }

    fpsManager() {

    }
}
