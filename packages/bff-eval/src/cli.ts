import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const cli = yargs(hideBin(process.argv))
  .scriptName("bff-eval")
  .usage("$0 [options]")
  .version("0.1.1")
  .help()
  .strict()
  .demandOption(
    ["input", "grader"],
    "Please provide both input and grader arguments",
  )
  .option("input", {
    alias: "i",
    type: "string",
    description: "Input JSONL file containing test cases",
    demandOption: true,
  })
  .option("grader", {
    alias: "g",
    type: "string",
    description: "Grader file to use for evaluation",
    demandOption: true,
  })
  .option("model", {
    alias: "m",
    type: "string",
    description: "LLM model to use",
    default: "gpt-4",
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Output file for results",
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Enable verbose logging",
    default: false,
  })
  .epilogue("Run LLM evaluation with graders")
  .example(
    "$0 --input test.jsonl --grader grader.ts",
    "Run evaluation with test cases from test.jsonl using grader.ts",
  )
  .example(
    "$0 -i data.jsonl -g eval.ts -m gpt-3.5-turbo -o results.json",
    "Run with custom model and output file",
  );
