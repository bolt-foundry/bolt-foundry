import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const cli = yargs(hideBin(process.argv))
  .scriptName("bff-eval")
  .usage("$0 [options]")
  .version("0.1.0")
  .help()
  .strict()
  .demandOption(
    ["input", "deck"],
    "Please provide both input and deck arguments",
  )
  .option("input", {
    alias: "i",
    type: "string",
    description: "Input JSONL file containing test cases",
    demandOption: true,
  })
  .option("deck", {
    alias: "d",
    type: "string",
    description: "Judge deck file to use for evaluation",
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
  .epilogue("Run LLM evaluation with judge decks")
  .example(
    "$0 --input test.jsonl --deck judge.ts",
    "Run evaluation with test cases from test.jsonl using judge.ts deck",
  )
  .example(
    "$0 -i data.jsonl -d eval.ts -m gpt-3.5-turbo -o results.json",
    "Run with custom model and output file",
  );
