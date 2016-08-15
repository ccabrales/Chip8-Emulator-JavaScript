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

    // Load the program into memory
    loadProgram(program) {
        for (let i = 0; i < program.length; i++) {
            this.memory[i + DEFAULT_PC] = program[i];
        }
    }

    setRenderer(renderer) {
        this.renderer = renderer;
    }

    setKey(key) {
        this.keys[key] = true;
    }

    unsetKey(key) {
        this.keys[key] = false;
    }

    //TODO
    setPixel(x, y) {

    }

    //TODO
    requestAnimFrame() {
        for (let i = 0; i < NUM_CYCLES; i++) {
            this.cycle();
        }
    }

    cycle() {
        // Able to read as a single number when joining them
        let opCode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];

        // Read the first portion to classify the code, then can nest further for more classification
        switch (opCode & 0xF000) {
            case 0x0000:

                switch (opCode) {
                    // CLS - Clear Screen
                    case 0x00E0:

                        break;

                    // RET - Return from subroutine
                    case 0x00EE:
                        break;

                }
                break;
            case 0x1000:
                break;
            case 0x2000:
                break;
            case 0x3000:
                break;
            case 0x4000:
                break;
            case 0x5000:
                break;
            case 0x6000:
                break;
            case 0x7000:
                break;
            case 0x8000:
                break;
            case 0x9000:
                break;
            case 0xA000:
                break;
            case 0xB000:
                break;
            case 0xC000:
                break;
            case 0xD000:
                break;
            case 0xE000:
                break;
            case 0xF000:
                break;
            default:
                throw new Error("Invalid opcode " + opCode.toString(16) + " received. Quitting now.");
        }
    }

    reset() {
        //Program Counter
        this.pc = DEFAULT_PC;

        // Memory
        for (let i = 0; i < MEM_SIZE; i++) {
            this.memory[i] = 0;
        }

        //Display
        for (let i = 0; i < display.length; i++) {
            this.display[i] = 0;
        }

        // Stack Pointer
        this.sp = 0;

        // "V" Registers
        for (let i = 0; i < this.v.length; i++) {
            v[i] = 0;
        }

        // "I" Register
        this.i = 0;

        // Delay Timer
        this.delayTimer = 0;

        // Sound Timer
        this.soundTimer = 0;

        this.step = 0;
        this.running = false;
    }
}