/**
 * Created by Casey on 8/15/16.
 */

class Gamepad {
    constructor(callback) {
        if (!callback || typeof callback != 'function') {
            throw new Error("You must specify a callback to implement");
        }
        this.callback = callback;
        this.running = false;
    }

    start() {
        if (!Gamepad.supported) return;

        this.running = true;
        this.step();
    }

    stop() {
        this.running = false;
    }

    step() {
        if (!this.running) return;

        this.callback(navigator.webkitGetGamepads());
        webkitRequestAnimationFrame(this.step.bind(this));
    }
}

Gamepad.supported = !!navigator.webkitGetGamepads;
