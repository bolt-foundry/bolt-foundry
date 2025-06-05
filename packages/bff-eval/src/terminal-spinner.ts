// Node.js-compatible terminal spinner for bff-eval
import { WriteStream } from "node:tty";

const moonFrames = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
const dotFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const lineFrames = ["─", "\\", "|", "/"];

export interface SpinnerOptions {
  text?: string;
  frames?: string[];
  frameDuration?: number;
  stream?: WriteStream;
}

export class TerminalSpinner {
  private frames: string[];
  private frameDuration: number;
  private stream: WriteStream;
  private interval: NodeJS.Timeout | null = null;
  private currentFrame = 0;
  private startTime: number = 0;
  private text: string;
  private isSpinning = false;

  constructor(options: SpinnerOptions = {}) {
    this.frames = options.frames || dotFrames;
    this.frameDuration = options.frameDuration || 80;
    this.stream = options.stream || process.stdout;
    this.text = options.text || "";
  }

  start(text?: string): void {
    if (this.isSpinning) return;
    
    this.isSpinning = true;
    this.startTime = Date.now();
    this.currentFrame = 0;
    
    if (text !== undefined) {
      this.text = text;
    }

    // Only show spinner if we're in a TTY
    if (!this.stream.isTTY) return;

    this.interval = setInterval(() => {
      this.render();
    }, this.frameDuration);
  }

  stop(): void {
    if (!this.isSpinning) return;
    
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

  succeed(text?: string): void {
    this.stop();
    if (this.stream.isTTY) {
      this.stream.write(`✅ ${text || this.text}\n`);
    } else {
      this.stream.write(`${text || this.text}\n`);
    }
  }

  fail(text?: string): void {
    this.stop();
    if (this.stream.isTTY) {
      this.stream.write(`❌ ${text || this.text}\n`);
    } else {
      this.stream.write(`ERROR: ${text || this.text}\n`);
    }
  }

  info(text?: string): void {
    this.stop();
    if (this.stream.isTTY) {
      this.stream.write(`ℹ️  ${text || this.text}\n`);
    } else {
      this.stream.write(`${text || this.text}\n`);
    }
  }

  update(text: string): void {
    this.text = text;
    if (this.isSpinning && this.stream.isTTY) {
      this.render();
    }
  }

  private render(): void {
    const frame = this.frames[this.currentFrame % this.frames.length];
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const line = `\r${frame} ${this.text} (${elapsed}s)`;
    
    this.stream.write(line);
    this.currentFrame++;
  }
}

// Progress bar for showing evaluation progress
export class ProgressBar {
  private total: number;
  private current = 0;
  private stream: WriteStream;
  private width: number;
  private startTime: number = 0;

  constructor(total: number, options: { stream?: WriteStream; width?: number } = {}) {
    this.total = total;
    this.stream = options.stream || process.stdout;
    this.width = options.width || 40;
  }

  start(): void {
    this.startTime = Date.now();
    this.current = 0;
    this.render();
  }

  update(current: number, message?: string): void {
    this.current = Math.min(current, this.total);
    this.render(message);
  }

  increment(message?: string): void {
    this.update(this.current + 1, message);
  }

  finish(message?: string): void {
    this.current = this.total;
    this.render(message);
    if (this.stream.isTTY) {
      this.stream.write("\n");
    }
  }

  private render(message?: string): void {
    if (!this.stream.isTTY) return;

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

// Simple spinner factory function for backward compatibility
export default function startSpinner(text?: string): () => void {
  const spinner = new TerminalSpinner({ text });
  spinner.start();
  return () => spinner.stop();
}