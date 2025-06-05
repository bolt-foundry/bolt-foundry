// Direct evaluation implementation that works around the file:// URL issue
import type { DeckBuilder } from "@bolt-foundry/bolt-foundry-next/builders";

interface RunOptions {
  input: string;
  grader: string;
  model?: string;
  output?: string;
  verbose?: boolean;
}

interface GradingResult {
  model: string;
  id?: string;
  iteration: number;
  score: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  latencyInMs: number;
  rawOutput: string;
  output: {
    score: number;
    notes?: string;
  };
  sample: any;
  sampleMetadata?: Record<string, unknown>;
}

function printLine(message: string) {
  console.log(message);
}

function printTable(data: unknown[] | Record<string, unknown>) {
  // Format numbers to at most 3 decimal places
  const formatValue = (value: unknown): unknown => {
    if (typeof value === "number") {
      // If it's an integer or has no decimal places, return as is
      if (Number.isInteger(value)) {
        return value;
      }
      // Otherwise format to at most 3 decimal places
      const formatted = parseFloat(value.toFixed(3));
      return formatted;
    }
    return value;
  };

  // Process the data
  let processedData: unknown[] | Record<string, unknown>;

  if (Array.isArray(data)) {
    processedData = data.map((row) => {
      if (typeof row === "object" && row !== null) {
        const processedRow: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(row)) {
          processedRow[key] = formatValue(value);
        }
        return processedRow;
      }
      return row;
    });
  } else if (typeof data === "object" && data !== null) {
    processedData = {};
    for (const [key, value] of Object.entries(data)) {
      processedData[key] = formatValue(value);
    }
  } else {
    processedData = data;
  }

  console.table(processedData);
}

export async function runEvaluation(options: RunOptions): Promise<void> {
  const { input, grader: graderPath, model = "openai/gpt-4o", output, verbose } = options;

  if (verbose) {
    console.log("Evaluation Configuration:");
    console.table({
      "Input File": input,
      "Grader File": graderPath,
      "Model": model,
      "Output": output || "Console",
    });
  }

  try {
    // Load files
    const fs = await import("node:fs/promises");
    const inputContent = await fs.readFile(input, 'utf-8');
    
    // Load grader module - support both .js and .ts files
    let graderModule: any;
    if (graderPath.endsWith('.ts')) {
      // For TypeScript files, use tsx to load them
      const tsx = await import('tsx') as any;
      const unregister = tsx.register();
      try {
        graderModule = require(graderPath);
      } finally {
        unregister();
      }
    } else {
      // For JavaScript files, use regular require
      graderModule = require(graderPath);
    }
    const grader: DeckBuilder = graderModule.default || graderModule;
    
    // Parse JSONL input
    const samples: any[] = [];
    const lines = inputContent.trim().split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const sample = JSON.parse(line);
        // Generate ID if missing
        if (!sample.id) {
          sample.id = `eval-${i + 1}`;
        }
        samples.push(sample);
      } catch (error) {
        throw new Error(
          `Invalid JSON on line ${i + 1}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
    
    // Process each sample
    const results: GradingResult[] = [];
    
    for (const sample of samples) {
      const startTime = performance.now();
      
      // Prepare context for the deck
      const context: Record<string, string> = {
        userMessage: sample.userMessage,
        assistantResponse: sample.assistantResponse,
      };
      
      if (sample.expected) {
        context.expected = sample.expected;
      }
      
      // Render the grader with the evaluation context
      const renderedGrader = grader.render({
        model,
        context,
        temperature: 0,
      });
      
      // Call LLM API via OpenRouter
      const apiKey = process.env.OPENROUTER_API_KEY || "";
      const response = await fetch(
        `https://openrouter.ai/api/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://boltfoundry.com",
            "X-Title": "Bolt Foundry Eval",
          },
          body: JSON.stringify(renderedGrader),
        },
      );
      
      const endTime = performance.now();
      const latencyInMs = endTime - startTime;
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      const apiResponse = await response.json() as any;
      const rawOutput = apiResponse.choices[0].message.content;
      
      // Parse the evaluation result
      let output: { score: number; notes?: string };
      try {
        output = JSON.parse(rawOutput);
      } catch (_parseError) {
        // If the grader fails to return valid JSON, that's a score of 0
        output = {
          score: 0,
          notes: `Grader failed to return valid JSON. Raw output: ${rawOutput}`,
        };
      }
      
      // Validate score is in range
      const score = Math.round(output.score) as GradingResult["score"];
      if (score < -3 || score > 3) {
        throw new Error(`Score ${score} is out of valid range [-3, 3]`);
      }
      
      // Create result
      const result: GradingResult = {
        model,
        id: sample.id,
        iteration: 1,
        score,
        latencyInMs,
        rawOutput,
        output,
        sample,
        sampleMetadata: Object.fromEntries(
          Object.entries(sample).filter(([key]) =>
            !["id", "userMessage", "assistantResponse", "expected"].includes(key)
          ),
        ),
      };
      
      results.push(result);
    }

    // Output results
    if (output) {
      // Write to file
      const outputData = results.map((r: any) => JSON.stringify(r)).join("\n");
      await fs.writeFile(output, outputData);
      console.log(`Results written to ${output}`);
    } else {
      // Output to console
      printLine("\nEvaluation Results:");
      printTable(
        results.map((r: any) => ({
          "Sample ID": r.id,
          "Score": r.score,
          "Latency (ms)": Math.round(r.latencyInMs),
        })),
      );

      // Summary statistics
      const scores = results.map((r: any) => r.score as number);
      const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
      const avgLatency = results.reduce((a: number, b: any) => a + b.latencyInMs, 0) /
        results.length;

      printLine("\nSummary Statistics:");
      printTable({
        "Average Score": avgScore,
        "Average Latency (ms)": avgLatency,
        "Total Samples": results.length,
      });

      // Calibration metrics if ground truth scores are present
      const resultsWithGroundTruth = results.filter((r: any) =>
        r.sampleMetadata && "score" in r.sampleMetadata
      );

      if (resultsWithGroundTruth.length > 0) {
        printLine("\nGrader Calibration Metrics:");

        // Calculate accuracy metrics
        let exactMatches = 0;
        let withinOne = 0;
        let totalError = 0;

        for (const result of resultsWithGroundTruth) {
          const groundTruth = result.sampleMetadata?.score as number;
          const diff = Math.abs(result.score - groundTruth);

          if (diff === 0) exactMatches++;
          if (diff <= 1) withinOne++;
          totalError += diff;
        }

        const exactAccuracy = exactMatches / resultsWithGroundTruth.length * 100;
        const withinOneAccuracy = withinOne / resultsWithGroundTruth.length * 100;
        const avgError = totalError / resultsWithGroundTruth.length;

        printTable({
          "Exact Match Rate": `${exactAccuracy.toFixed(1)}% (${exactMatches}/${resultsWithGroundTruth.length})`,
          "Within ±1 Accuracy": `${withinOneAccuracy.toFixed(1)}% (${withinOne}/${resultsWithGroundTruth.length})`,
          "Average Absolute Error": avgError,
          "Total Samples with Ground Truth": resultsWithGroundTruth.length,
        });

        // Show disagreements
        const disagreements = resultsWithGroundTruth.filter((r: any) =>
          r.score !== (r.sampleMetadata?.score as number)
        );

        if (disagreements.length > 0) {
          printLine("\nDisagreements:");
          printTable(
            disagreements.map((result: any) => {
              const groundTruth = result.sampleMetadata
                ?.score as number;
              return {
                "Sample ID": result.id,
                "Grader Score": result.score,
                "Ground Truth": groundTruth,
                "Difference": result.score - groundTruth,
                "Assistant Response": result.sample?.assistantResponse ||
                  "No response available",
              };
            }),
          );

          // Detailed breakdown of each disagreement
          printLine("\nDetailed Disagreement Analysis:");
          disagreements.forEach((result: any, index: number) => {
            const groundTruth = result.sampleMetadata
              ?.score as number;
            printLine(`\n${"=".repeat(80)}`);
            printLine(
              `Disagreement ${index + 1} - Sample ID: ${result.id || "N/A"}`,
            );
            printLine(`${"=".repeat(80)}`);

            // Show sample data and scores in a single table
            printLine("\nSample Details:");
            const sampleData: Record<string, unknown> = {};

            // Display the original sample data
            if (result.sample) {
              sampleData["User Message"] = result.sample.userMessage;
              sampleData["Assistant Response"] =
                result.sample.assistantResponse;

              // Add expected value if present
              if (result.sample.expected) {
                sampleData["Expected"] = result.sample.expected;
              }

              // Add description from metadata if available
              if (result.sampleMetadata?.description) {
                sampleData["Description"] = result.sampleMetadata.description;
              }

              // Add any other sample fields (excluding the ones we already displayed)
              const excludedFields = [
                "id",
                "userMessage",
                "assistantResponse",
                "expected",
                "score",
              ];
              Object.entries(result.sample).forEach(([key, value]) => {
                if (!excludedFields.includes(key)) {
                  const displayKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();
                  sampleData[displayKey] = value;
                }
              });
            }

            // Add score comparison to the same table
            sampleData["Grader Score"] = result.score;
            sampleData["Ground Truth"] = groundTruth;
            sampleData["Difference"] = result.score - groundTruth;

            printTable(sampleData);

            // Print grader notes below the table
            printLine("\nGrader Notes:");
            printLine(result.output.notes || "No notes provided");
          });
        }
      }
    }
  } catch (error) {
    console.error(`Evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}