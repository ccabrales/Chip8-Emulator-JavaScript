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
        this.display = new Array(this.displayHeight * this.displayWidth);

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

    setPixel(x, y) {
        // check for out of bounds, to wrap the pixel
        if (y < 0) {
            y += this.displayHeight;
        } else if (y > this.displayHeight) {
            y -= this.displayHeight;
        }
        if (x < 0) {
            x += this.displayWidth;
        } else if (x > this.displayWidth) {
            x -= this.displayWidth;
        }

        let displayIndex = (y * this.displayWidth) + x;
        this.display[displayIndex] ^= 1;

        return !this.display[displayIndex];
    }

    start() {
        this.running = true;
        let self = this;

        requestAnimFrame(function me() {
            for (let i = 0; i < NUM_CYCLES; i++) {
                if (self.running) {
                    self.emulateCycle();
                }
            }

            if (self.drawFlag) {
                self.renderer.render(self.display);
                self.drawFlag = false;
            }

            if (!(self.step++ % 2)) {
                if (self.delayTimer > 0) {
                    self.delayTimer--;
                }
                if (self.soundTimer > 0) {
                    self.soundTimer--;
                    if (self.soundTimer === 0) {
                        self.renderer.beep();
                    }
                }
            }

            requestAnimFrame(me);
        });

        // window.requestAnimationFrame(this.requestAnimFrame);
    }

    stop() {
        this.running = false;
    }

    emulateCycle() {
        // Able to read as a single number when joining them
        let opCode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
        let x = (opCode & 0x0F00) >> 8;
        let y = (opCode & 0x00F0) >> 4;

        // Increment pc by 2
        this.pc += 2;

        // Read the first portion to classify the code, then can nest further for more classification
        switch (opCode & 0xF000) {
            case 0x0000:

                switch (opCode) {
                    // CLS - Clear Screen
                        // clear renderer and reset display
                    case 0x00E0:
                        this.renderer.clear();
                        for (let i = 0; i < this.display.length; i++) {
                            this.display[i] = 0;
                        }
                        break;

                    // RET - Return from subroutine
                    case 0x00EE:
                        this.pc = this.stack[--this.sp];
                        break;

                    default:
                        throw new Error("Invalid opcode " + opCode.toString(16) + " received. Quitting now.");
                }
                break;

            // JP address
                // jump to address 1NNN
            case 0x1000:
                this.pc = opCode & 0xFFF;
                break;

            // CALL subroutine
                // call at 2NNN
            case 0x2000:
                this.stack[this.sp] = this.pc;
                this.sp++;
                this.pc = opCode & 0xFFF;
                break;

            // SE 3XNN
                // skip next instruction if Vx == NN
            case 0x3000:
                if (this.v[x] === (opCode & 0xFF)) {
                    this.pc += 2;
                }
                break;

            // SNE 4XNN
                // skip next instruction if Vx != NN
            case 0x4000:
                if (this.v[x] !== (opCode & 0x00FF)) {
                    this.pc += 2;
                }
                break;

            // SE 5XY0
                // skips next instruction if Vx === Vy
            case 0x5000:
                if (this.v[x] === this.v[y]) {
                    this.pc += 2;
                }
                break;

            // LD 6XNN
                // sets Vx to NN
            case 0x6000:
                this.v[x] = (opCode & 0xFF);
                break;

            // ADD 7XNN
                // add NN to Vx
            case 0x7000:
                let calc = this.v[x] + (opCode & 0xFF);
                // Prevent overflow
                if (calc > 255) {
                    calc -= 256;
                }
                this.v[x] = calc;
                break;

            case 0x8000:
                switch (opCode & 0x000F) {
                    // LD 8XY0
                        // set Vx to Vy
                    case 0x0000:
                        this.v[x] = this.v[y];
                        break;

                    // OR 8XY1
                        // set Vx to Vx OR Vy
                    case 0x0001:
                        this.v[x] |= this.v[y];
                        break;

                    // AND 8XY2
                        // set Vx to Vx AND Vy
                    case 0x0002:
                        this.v[x] &= this.v[y];
                        break;

                    // XOR 8XY3
                        // set Vx to Vx XOR Vy
                    case 0x0003:
                        this.v[x] ^= this.v[y];
                        break;

                    // ADD 8XY4
                        // adds Vy to Vx. VF is set to 1 when there's a carry, 0 otherwise
                    case 0x0004:
                        this.v[x] += this.v[y];
                        this.v[0xF] = +(this.v[x] > 255);

                        if (this.v[x] > 255) {
                            this.v[x] -= 256;
                        }
                        break;

                    // SUB 8XY5
                        // subtract Vy from Vx. VF is set to 0 when there's a borrow, 0 otherwise
                    case 0x0005:
                        this.v[0xF] = +(this.v[x] > this.v[y]);
                        this.v[x] -= this.v[y];
                        if (this.v[x] < 0) {
                            this.v[x] += 256;
                        }
                        break;

                    // SHR 8XY6
                        // shift Vx right by one. VF is set to least significant bit of Vx before the shift
                    case 0x0006:
                        this.v[0xF] = this.v[x] & 0x1;
                        this.v[x] >>= 1;
                        break;

                    // SUBN 8XY7
                        // set Vx to Vy - Vx. VF is set to 0 when there's a borrow, 1 otherwise
                    case 0x0007:
                        this.v[0xF] = +(this.v[x] > this.v[y]);
                        this.v[x] = this.v[y] = this.v[x];
                        if (this.v[x] < 0) {
                            this.v[x] += 256;
                        }
                        break;

                    // SHL 8XYE
                        // shift Vx left by one. VF set to most significant bit of Vx before shift
                    case 0x000E:
                        this.v[0xF] = this.v[x] & 0x8;
                        this.v[x] <<= 1;
                        break;

                    default:
                        throw new Error("Invalid opcode " + opCode.toString(16) + " received. Quitting now.");
                }
                break;

            // SNE 9XY0
                // skips next instruction if Vx != Vy
            case 0x9000:
                if (this.v[x] !== this.v[y]) {
                    this.pc += 2;
                }
                break;

            // LD I ANNN
                // sets I to address NNN
            case 0xA000:
                this.i = opCode & 0xFFF;
                break;

            // JP V0 BNNN
                // jumps to address NNN + V0
            case 0xB000:
                this.pc = (opCode & 0xFFF) + this.v[0];
                break;

            // RND CXNN
                // set Vx to result of AND on a random number and NN
            case 0xC000:
                this.v[x] = Math.floor(Math.random() * 0xFF) & (opCode & 0xFF);
                break;

            // DRW DXYN
                // draws a sprite at coordinate (Vx, Vy) with a width of 8 pixels and height of N pixels
                // each row of 8 pixels is read as a bit-coded starting from memory location I
                // VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, 0 otherwise
            case 0xD000:
                let width = 8;
                let height = opCode & 0x000F;
                this.v[0xF] = 0;
                let i, j, pixelRow;

                // Go row by row for outer loop, and inner loop go column by column
                for (i = 0; i < height; i++) {
                    pixelRow = this.memory[this.i + i];
                    for (j = 0; j < width; j++) {
                        // check for whether highest bit is 1 and there is an overlap/flipping pixels b/c of it
                        if ((pixelRow & 0x80) > 0 && this.setPixel(this.v[x] + j, this.v[y] + i)) {
                            this.v[0xF] = 1;
                        }
                        pixelRow <<= 1; // shift left by one every iteration to get every bit as highest to test
                    }
                    this.drawFlag = true;
                }
                break;

            case 0xE000:
                switch(opCode & 0x00FF) {

                    // SKP EX9E
                        // skips next instruction if the key stored in Vx is pressed
                    case 0x009E:
                        if (this.keys[this.v[x]]) {
                            this.pc += 2;
                        }
                        break;

                    // SKNP EXA1
                        // skips next instruction if the key stored in Vx is not pressed
                    case 0x00A1:
                        if (!this.keys[this.v[x]]) {
                            this.pc += 2;
                        }
                        break;

                    default:
                        throw new Error("Invalid opcode " + opCode.toString(16) + " received. Quitting now.");
                }
                break;

            case 0xF000:
                switch(opCode & 0x00FF) {

                    // LD FX07
                        // set Vx to value of delay timer
                    case 0x0007:
                        this.v[x] =  this.delayTimer;
                        break;

                    // LD FX0A
                        // wait for key press, then store in Vx. all execution stops until the key press
                        //TODO
                    case 0x000A:
                        this.stop();
                        let keyPressed = false;

                        for (let i = 0; i < 16; i++) {
                            if (this.keys[i]) {
                                this.v[x] = i;
                                keyPressed = true;
                            }
                        }

                        // skip and try again if no key was pressed. rewind pc
                        if (!keyPressed) {
                            this.pc -= 2;
                            return;
                        }

                        this.start();

                        break;

                    // LD FX15
                        // sets delay timer to Vx
                    case 0x0015:
                        this.delayTimer = this.v[x];
                        break;

                    // LD FX18
                        // sets sound timer to Vx
                    case 0x0018:
                        this.soundTimer = this.v[x];
                        break;

                    // ADD I FX1E
                        // adds Vx to I
                    case 0x001E:
                        this.i += this.v[x];
                        break;

                    // LD F FX29
                        // sets I to the location of the sprite for the character in Vx
                        // characters 0-F are represented by a 4x5 font
                    case 0x0029:
                        this.i = this.v[x] * 5;
                        break;

                    // LD B FX33
                        // stores binary representation of Vx in memory, with the most significant of three digits
                        // at addr in I, middle digit at I+1, LSB at I+2
                    case 0x0033:
                        var dec = this.v[x];

                        for (let i = this.i + 2; i >= this.i - 2; i--) {
                            this.memory[i] = parseInt(dec % 10);
                            dec /= 10;
                        }
                        break;

                    // LD [I] FX55
                        // stores V0 to Vx (inclusive) in memory address starting at address I
                    case 0x0055:
                        for (let i = 0; i <= x; i++) {
                            this.memory[this.i + i] = this.v[i];
                        }
                        break;

                    // LD Vx FX65
                        // fills V0 to Vx (inclusive) with values from memory starting at address I
                    case 0x0065:
                        for (let i = 0; i <= x; i++) {
                            this.v[i] = this.memory[this.i + i];
                        }
                        break;
                    default:
                        throw new Error("Invalid opcode " + opCode.toString(16) + " received. Quitting now.");
                }
                break;

            default:
                throw new Error("Invalid opcode " + opCode.toString(16) + " received. Quitting now.");
        }
    }

    reset() {
        //Program Counter
        this.pc = DEFAULT_PC;

        // Memory reset
        for (let i = 0; i < MEM_SIZE; i++) {
            this.memory[i] = 0;
        }

        // Load Fontset
        let fontSet = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80 // F
        ];

        for (let i = 0; i < fontSet.length; i++) {
            this.memory[i] = fontSet[i];
        }

        //Display
        for (let i = 0; i < this.display.length; i++) {
            this.display[i] = 0;
        }

        // Stack Pointer
        this.sp = 0;

        // "V" Registers
        for (let i = 0; i < this.v.length; i++) {
            this.v[i] = 0;
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