"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = exports.TerminalSpinner = void 0;
exports.default = startSpinner;
const moonFrames = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
const dotFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const lineFrames = ["─", "\\", "|", "/"];
class TerminalSpinner {
    frames;
    frameDuration;
    stream;
    interval = null;
    currentFrame = 0;
    startTime = 0;
    text;
    isSpinning = false;
    constructor(options = {}) {
        this.frames = options.frames || dotFrames;
        this.frameDuration = options.frameDuration || 80;
        this.stream = options.stream || process.stdout;
        this.text = options.text || "";
    }
    start(text) {
        if (this.isSpinning)
            return;
        this.isSpinning = true;
        this.startTime = Date.now();
        this.currentFrame = 0;
        if (text !== undefined) {
            this.text = text;
        }
        // Only show spinner if we're in a TTY
        if (!this.stream.isTTY)
            return;
        this.interval = setInterval(() => {
            this.render();
        }, this.frameDuration);
    }
    stop() {
        if (!this.isSpinning)
            return;
        this.isSpinning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        // Clear the line
        if (this.stream.isTTY) {
            this.stream.write("\r\x1b[K");
        }
    }
    succeed(text) {
        this.stop();
        if (this.stream.isTTY) {
            this.stream.write(`✅ ${text || this.text}\n`);
        }
        else {
            this.stream.write(`${text || this.text}\n`);
        }
    }
    fail(text) {
        this.stop();
        if (this.stream.isTTY) {
            this.stream.write(`❌ ${text || this.text}\n`);
        }
        else {
            this.stream.write(`ERROR: ${text || this.text}\n`);
        }
    }
    info(text) {
        this.stop();
        if (this.stream.isTTY) {
            this.stream.write(`ℹ️  ${text || this.text}\n`);
        }
        else {
            this.stream.write(`${text || this.text}\n`);
        }
    }
    update(text) {
        this.text = text;
        if (this.isSpinning && this.stream.isTTY) {
            this.render();
        }
    }
    render() {
        const frame = this.frames[this.currentFrame % this.frames.length];
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const line = `\r${frame} ${this.text} (${elapsed}s)`;
        this.stream.write(line);
        this.currentFrame++;
    }
}
exports.TerminalSpinner = TerminalSpinner;
// Progress bar for showing evaluation progress
class ProgressBar {
    total;
    current = 0;
    stream;
    width;
    startTime = 0;
    constructor(total, options = {}) {
        this.total = total;
        this.stream = options.stream || process.stdout;
        this.width = options.width || 40;
    }
    start() {
        this.startTime = Date.now();
        this.current = 0;
        this.render();
    }
    update(current, message) {
        this.current = Math.min(current, this.total);
        this.render(message);
    }
    increment(message) {
        this.update(this.current + 1, message);
    }
    finish(message) {
        this.current = this.total;
        this.render(message);
        if (this.stream.isTTY) {
            this.stream.write("\n");
        }
    }
    render(message) {
        if (!this.stream.isTTY)
            return;
        const percent = this.current / this.total;
        const filled = Math.floor(percent * this.width);
        const empty = this.width - filled;
        const bar = "█".repeat(filled) + "░".repeat(empty);
        const percentStr = `${Math.floor(percent * 100)}%`.padStart(4);
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const rate = this.current > 0 ? (this.current / parseFloat(elapsed)).toFixed(1) : "0.0";
        let line = `\r[${bar}] ${percentStr} | ${this.current}/${this.total} | ${elapsed}s | ${rate}/s`;
        if (message) {
            line += ` | ${message}`;
        }
        // Clear to end of line to remove any previous longer text
        line += "\x1b[K";
        this.stream.write(line);
    }
}
exports.ProgressBar = ProgressBar;
// Simple spinner factory function for backward compatibility
function startSpinner(text) {
    const spinner = new TerminalSpinner({ text });
    spinner.start();
    return () => spinner.stop();
}
