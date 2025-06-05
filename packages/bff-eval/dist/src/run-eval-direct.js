"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEvaluation = runEvaluation;
function printLine(message) {
    console.log(message);
}
function printTable(data) {
    console.table(data);
}
async function runEvaluation(options) {
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
        // Load grader module directly
        const graderModule = require(graderPath);
        const grader = graderModule.default || graderModule;
        // Parse JSONL input
        const samples = [];
        const lines = inputContent.trim().split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            try {
                const sample = JSON.parse(line);
                // Generate ID if missing
                if (!sample.id) {
                    sample.id = `eval-${i + 1}`;
                }
                samples.push(sample);
            }
            catch (error) {
                throw new Error(`Invalid JSON on line ${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        // Process each sample
        const results = [];
        for (const sample of samples) {
            const startTime = performance.now();
            // Prepare context for the deck
            const context = {
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
            const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": "https://boltfoundry.com",
                    "X-Title": "Bolt Foundry Eval",
                },
                body: JSON.stringify(renderedGrader),
            });
            const endTime = performance.now();
            const latencyInMs = endTime - startTime;
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }
            const apiResponse = await response.json();
            const rawOutput = apiResponse.choices[0].message.content;
            // Parse the evaluation result
            let output;
            try {
                output = JSON.parse(rawOutput);
            }
            catch (_parseError) {
                // If the grader fails to return valid JSON, that's a score of 0
                output = {
                    score: 0,
                    notes: `Grader failed to return valid JSON. Raw output: ${rawOutput}`,
                };
            }
            // Validate score is in range
            const score = Math.round(output.score);
            if (score < -3 || score > 3) {
                throw new Error(`Score ${score} is out of valid range [-3, 3]`);
            }
            // Create result
            const result = {
                model,
                id: sample.id,
                iteration: 1,
                score,
                latencyInMs,
                rawOutput,
                output,
                sample,
                sampleMetadata: Object.fromEntries(Object.entries(sample).filter(([key]) => !["id", "userMessage", "assistantResponse", "expected"].includes(key))),
            };
            results.push(result);
        }
        // Output results
        if (output) {
            // Write to file
            const outputData = results.map((r) => JSON.stringify(r)).join("\n");
            await fs.writeFile(output, outputData);
            console.log(`Results written to ${output}`);
        }
        else {
            // Output to console
            printLine("\nEvaluation Results:");
            printTable(results.map((r) => ({
                "Sample ID": r.id,
                "Score": r.score,
                "Latency (ms)": Math.round(r.latencyInMs),
            })));
            // Summary statistics
            const scores = results.map((r) => r.score);
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            const avgLatency = results.reduce((a, b) => a + b.latencyInMs, 0) /
                results.length;
            printLine("\nSummary Statistics:");
            printTable({
                "Average Score": avgScore.toFixed(2),
                "Average Latency (ms)": Math.round(avgLatency),
                "Total Samples": results.length,
            });
            // Calibration metrics if ground truth scores are present
            const resultsWithGroundTruth = results.filter((r) => r.sampleMetadata && "score" in r.sampleMetadata);
            if (resultsWithGroundTruth.length > 0) {
                printLine("\nGrader Calibration Metrics:");
                // Calculate accuracy metrics
                let exactMatches = 0;
                let withinOne = 0;
                let totalError = 0;
                for (const result of resultsWithGroundTruth) {
                    const groundTruth = result.sampleMetadata?.score;
                    const diff = Math.abs(result.score - groundTruth);
                    if (diff === 0)
                        exactMatches++;
                    if (diff <= 1)
                        withinOne++;
                    totalError += diff;
                }
                const exactAccuracy = exactMatches / resultsWithGroundTruth.length * 100;
                const withinOneAccuracy = withinOne / resultsWithGroundTruth.length * 100;
                const avgError = totalError / resultsWithGroundTruth.length;
                printTable({
                    "Exact Match Rate": `${exactAccuracy.toFixed(1)}% (${exactMatches}/${resultsWithGroundTruth.length})`,
                    "Within ±1 Accuracy": `${withinOneAccuracy.toFixed(1)}% (${withinOne}/${resultsWithGroundTruth.length})`,
                    "Average Absolute Error": avgError.toFixed(2),
                });
            }
        }
    }
    catch (error) {
        console.error(`Evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}
