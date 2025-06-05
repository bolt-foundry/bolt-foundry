"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
exports.cli = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .scriptName("bff-eval")
    .usage("$0 [options]")
    .version("0.1.1")
    .help()
    .strict()
    .option("input", {
    alias: "i",
    type: "string",
    description: "Input JSONL file containing test cases",
})
    .option("grader", {
    alias: "g",
    type: "string",
    description: "Grader file to use for evaluation",
})
    .option("demo", {
    alias: "d",
    type: "string",
    description: "Run a demo from the examples folder (omit value for random demo)",
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
    .example("$0 --input test.jsonl --grader grader.js", "Run evaluation with test cases from test.jsonl using grader.js")
    .example("$0 -i data.jsonl -g eval.js -m gpt-3.5-turbo -o results.json", "Run with custom model and output file")
    .example("$0 --demo json-validator", "Run the json-validator demo")
    .example("$0 --demo", "Run a random demo from the examples folder")
    .check((argv) => {
    // Check for mutually exclusive options
    if (argv.demo !== undefined && (argv.input || argv.grader)) {
        throw new Error("--demo flag is mutually exclusive with --input and --grader flags");
    }
    // Check that either demo or both input/grader are provided
    if (argv.demo === undefined && (!argv.input || !argv.grader)) {
        throw new Error("Please provide either --demo flag or both --input and --grader arguments");
    }
    // If using demo, resolve the demo paths
    if (argv.demo !== undefined) {
        const examplesDir = path.join(__dirname, "..", "..", "examples");
        let demoName = argv.demo;
        // If demo value is empty string (from --demo with no value), pick a random demo
        if (demoName === "" || typeof demoName === "boolean") {
            try {
                const demos = fs.readdirSync(examplesDir, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
                if (demos.length === 0) {
                    throw new Error("No demo folders found in examples directory");
                }
                demoName = demos[Math.floor(Math.random() * demos.length)];
                console.log(`Randomly selected demo: ${demoName}`);
            }
            catch (error) {
                throw new Error(`Failed to read examples directory: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        const demoDir = path.join(examplesDir, demoName);
        const graderPath = path.join(demoDir, "grader.js");
        const samplesPath = path.join(demoDir, "samples.jsonl");
        // Check if demo exists
        if (!fs.existsSync(demoDir)) {
            // List available demos
            try {
                const demos = fs.readdirSync(examplesDir, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
                throw new Error(`Demo '${demoName}' not found. Available demos: ${demos.join(", ") || "(none)"}`);
            }
            catch (error) {
                if (error instanceof Error && error.message.includes("Demo")) {
                    throw error;
                }
                throw new Error(`Demo '${demoName}' not found and couldn't list available demos`);
            }
        }
        // Check if required files exist
        if (!fs.existsSync(graderPath)) {
            throw new Error(`Demo '${demoName}' is missing grader.js file`);
        }
        if (!fs.existsSync(samplesPath)) {
            throw new Error(`Demo '${demoName}' is missing samples.jsonl file`);
        }
        // Set the input and grader paths
        argv.input = samplesPath;
        argv.grader = graderPath;
        console.log(`Running demo: ${demoName}`);
    }
    else {
        // Resolve paths relative to current working directory
        if (argv.input) {
            argv.input = path.resolve(process.cwd(), argv.input);
        }
        if (argv.grader) {
            argv.grader = path.resolve(process.cwd(), argv.grader);
        }
        if (argv.output) {
            argv.output = path.resolve(process.cwd(), argv.output);
        }
    }
    return true;
});
