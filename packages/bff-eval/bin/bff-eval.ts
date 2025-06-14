#!/usr/bin/env node

import { cli } from "../src/cli";
import { runEvaluation } from "../src/run-eval";

async function main() {
  const args = await cli.parse();

  // The CLI has already validated and set up input/grader paths
  if (args.input && args.grader) {
    await runEvaluation({
      input: args.input as string,
      grader: args.grader as string,
      model: args.model as string,
      output: args.output as string | undefined,
      verbose: args.verbose as boolean,
    });
  }
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
