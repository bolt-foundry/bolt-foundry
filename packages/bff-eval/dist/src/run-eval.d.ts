interface RunOptions {
    input: string;
    grader: string;
    model?: string;
    output?: string;
    verbose?: boolean;
}
export declare function runEvaluation(options: RunOptions): Promise<void>;
export {};
//# sourceMappingURL=run-eval.d.ts.map