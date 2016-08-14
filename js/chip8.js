/*
    Created by: Casey Cabrales
    8/13/16

    In reference to tutorial at http://blog.alexanderdickson.com/javascript-chip-8-emulator
    by Alexander Dickson.
 */

class Chip8 {

    constructor() {
        this.displayHeight = DISPLAY_HEIGHT;
        this.displayWidth = DISPLAY_WIDTH;
        this.display = new Array(displayHeight * displayWidth);

        this.step = null;
        this.running = null;

        let mem = new ArrayBuffer(MEM_SIZE);
        this.memory = new Uint8Array(mem);

        this.stack = new Array(16);
        this.sp = null;
        this.v = new Uint8Array(16);
        this.i = null;
        this.delayTimer = null;
        this.delayTimer = null;

        this.renderer = null;
        this.keys = {};

        this.reset();
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    requestAnimFrame() {
        for (let i = 0; i < NUM_CYCLES; i++) {
            this.cycle();
        }
    }

    cycle() {

    }

    reset() {
        //Program Counter
        this.pc = DEFAULT_PC;

        // Memory
        this.memory = new Uint8Array(4096);

        // Stack
        this.stack = new Array(16);

        // Stack Pointer
        this.sp = 0;

        // "V" Registers
        this.v = new Uint8Array(16);

        // "I" Register
        this.i = 0;

        // Delay Timer
        this.delayTimer = 0;

        // Sound Timer
        this.soundTimer = 0;
    }
}