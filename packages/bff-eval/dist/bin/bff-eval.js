#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("../src/cli");
const run_eval_1 = require("../src/run-eval");
async function main() {
    const args = await cli_1.cli.parse();
    // The CLI has already validated and set up input/grader paths
    if (args.input && args.grader) {
        await (0, run_eval_1.runEvaluation)({
            input: args.input,
            grader: args.grader,
            model: args.model,
            output: args.output,
            verbose: args.verbose,
        });
    }
}
main().catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
});
