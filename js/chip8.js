/*
    Created by: Casey Cabrales
    8/13/16

    In reference to tutorial at http://blog.alexanderdickson.com/javascript-chip-8-emulator
    by Alexander Dickson.
 */

class Chip8 {
    reset() {
        //Program Counter
        this.pc = 0x200;

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