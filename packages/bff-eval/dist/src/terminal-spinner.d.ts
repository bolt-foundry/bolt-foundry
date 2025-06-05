import { WriteStream } from "node:tty";
export interface SpinnerOptions {
    text?: string;
    frames?: string[];
    frameDuration?: number;
    stream?: WriteStream;
}
export declare class TerminalSpinner {
    private frames;
    private frameDuration;
    private stream;
    private interval;
    private currentFrame;
    private startTime;
    private text;
    private isSpinning;
    constructor(options?: SpinnerOptions);
    start(text?: string): void;
    stop(): void;
    succeed(text?: string): void;
    fail(text?: string): void;
    info(text?: string): void;
    update(text: string): void;
    private render;
}
export declare class ProgressBar {
    private total;
    private current;
    private stream;
    private width;
    private startTime;
    constructor(total: number, options?: {
        stream?: WriteStream;
        width?: number;
    });
    start(): void;
    update(current: number, message?: string): void;
    increment(message?: string): void;
    finish(message?: string): void;
    private render;
}
export default function startSpinner(text?: string): () => void;
//# sourceMappingURL=terminal-spinner.d.ts.map