# Calibrate Migration to Render Style

## Overview

Migrate `aibff calibrate` from deck builder style to render style, focusing on
simplicity while preserving core evaluation functionality.

## Implementation Plan

### Core Flow

1. Read deck markdown file
2. Parse with `makeDeckFromMarkdown` to get the deck
3. Implement temporary inline `extractSamplesFromMarkdown` (returns dummy data)
4. Create new evaluation function with concurrency control
5. Output results in TOML/HTML using existing format

### Changes Required

#### Remove

- ❌ `parseMarkdownToDeck` - replace with `makeDeckFromMarkdown`
- ❌ Grader-base.deck.md merging
- ❌ Context variables (typed Q&A format)
- ❌ Sample tags and filtering
- ❌ All CLI options except: concurrency, model selection, output format
- ❌ `runSampleLevelParallelEval` - replace with new evaluation function
- ❌ Delete or ignore existing tests

#### Keep

- ✅ TOML and HTML output formats (with existing data structure)
- ✅ Progress reporting
- ✅ Concurrency control (`--concurrency`)
- ✅ Model selection (`--model`)
- ✅ Output format selection
- ✅ Existing output data structure (OutputFile, GraderResultsSection, etc.)

#### Add

- ✅ Inline `extractSamplesFromMarkdown` (temporary, returns dummy data)
- ✅ New evaluation function that queues messages with concurrency control

### Code Structure

```typescript
// Note: renderDeck will be implemented inline in the render command file,
// not imported from a separate module

// Minimal types for output structure
interface Sample {
  id: string;
  input: string;
  expected: string;
}

interface GraderResult {
  id: string;
  grader_score: number;
  truth_score: number;
  notes: string;
  userMessage: string;
  assistantResponse: string;
}

interface OutputFile {
  results: GraderResult[];
  model: string;
  timestamp: string;
}

// Temporary inline implementation - always returns same two samples
function extractSamplesFromMarkdown(content: string): Sample[] {
  return [
    { id: "sample1", input: "What is 2+2?", expected: "4" },
    { id: "sample2", input: "What is 10/5?", expected: "2" },
  ];
}

// Stub implementation - returns fake AI response
async function sendToAI(messages: any[], model: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate API delay
  return "This is a fake AI response for testing";
}

// Always returns fixed score
function calculateScore(response: string, expected: string): number {
  return 0.85; // Fixed score for all evaluations
}

// New evaluation function with Set-based concurrency control
async function runEvaluationWithConcurrency(
  messages: Array<{ role: string; content: string }>,
  samples: Sample[],
  models: string[],
  concurrency: number,
): Promise<OutputFile[]> {
  const allResults: OutputFile[] = [];

  for (const model of models) {
    console.log(`Evaluating with model: ${model}`);
    const activeRequests = new Set<Promise<GraderResult>>();
    const results: GraderResult[] = [];

    for (let index = 0; index < samples.length; index++) {
      const sample = samples[index];
      console.log(`Processing sample ${index + 1} of ${samples.length}...`);

      // Wait if we're at concurrency limit
      if (activeRequests.size >= concurrency) {
        await Promise.race(activeRequests);
      }

      // Create and track the request
      const promise = (async (): Promise<GraderResult> => {
        try {
          const response = await sendToAI(messages, model);
          return {
            id: sample.id,
            grader_score: calculateScore(response, sample.expected),
            truth_score: 1, // Assuming expected is truth
            notes: "",
            userMessage: sample.input,
            assistantResponse: response,
          };
        } catch (error) {
          console.error(`Error processing sample ${sample.id}:`, error);
          return {
            id: sample.id,
            grader_score: 0,
            truth_score: 0,
            notes: `Error: ${error.message}`,
            userMessage: sample.input,
            assistantResponse: "",
          };
        }
      })();

      activeRequests.add(promise);
      promise.then((result) => {
        results.push(result);
        activeRequests.delete(promise);
      });
    }

    // Wait for all remaining requests
    await Promise.all(activeRequests);

    // Calculate average score for logging
    const averageScore = results.reduce((sum, r) => sum + r.grader_score, 0) /
      results.length;
    console.log(
      `Completed evaluation. Average score: ${averageScore.toFixed(2)}`,
    );

    allResults.push({
      results,
      model,
      timestamp: new Date().toISOString(),
    });
  }

  return allResults;
}

async function calibrateCommand(deckPath: string, options: CalibrateOptions) {
  // 1. Read deck
  const deckText = await Deno.readTextFile(deckPath);

  // 2. Extract samples (inline temporary implementation)
  const samples = extractSamplesFromMarkdown(deckText);

  // 3. Parse models from comma-separated list
  const models = options.model.split(",").map((m) => m.trim());

  // 4. Render messages for AI
  // Note: renderDeck now takes 4 parameters and returns OpenAICompletionRequest
  const context = {}; // Empty context values for calibration
  const extractedContext = {}; // Empty context definitions for calibration
  const openAiCompletionOptions = {}; // Empty OpenAI options
  const openAiRequest = renderDeck(
    deckText,
    context,
    extractedContext,
    openAiCompletionOptions,
  );
  const messages = openAiRequest.messages; // Extract messages array from the request object

  // 5. Run evaluation with new function
  const allResults = await runEvaluationWithConcurrency(
    messages,
    samples,
    models,
    options.concurrency,
  );

  // 6. Output results for each model
  for (const results of allResults) {
    const outputPrefix = models.length > 1 ? `${results.model}-` : "";

    if (options.format === "toml") {
      const tomlContent = stringifyToml(results);
      await Deno.writeTextFile(`${outputPrefix}results.toml`, tomlContent);
    } else {
      const htmlContent = generateEvaluationHtml(results);
      await Deno.writeTextFile(`${outputPrefix}results.html`, htmlContent);
    }
  }
}
```

### CLI Interface

#### Before

```bash
aibff calibrate deck.md --model gpt-4 --concurrency 5 --context-vars vars.json --filter "tag:math" --grader-base custom.deck.md
```

#### After

```bash
aibff calibrate deck.md --model gpt-4 --concurrency 5
```

### Dependencies

renderDeck function will be available from the render command implementation:

```typescript
// renderDeck will be implemented inline in the render command file
// Per the context injection plan, it has this signature:
function renderDeck(
  deckMarkdown: string,
  context: Record<string, unknown>,
  extractedContext: ExtractedContext,
  openAiCompletionOptions: Record<string, unknown> = {},
): OpenAICompletionRequest {
  // Returns complete OpenAI request with messages array
}

// Where OpenAICompletionRequest is:
interface OpenAICompletionRequest {
  messages: Array<{ role: string; content: string }>;
  [key: string]: unknown; // Additional OpenAI parameters
}

// ExtractedContext type (from context injection plan):
interface ExtractedContext {
  [variableName: string]: {
    assistantQuestion: string;
    default?: unknown;
    description?: string;
    type?: string;
    sourceFile?: string;
    [key: string]: unknown;
  };
}
```

extractSamplesFromMarkdown will be implemented inline temporarily as a stub that
always returns the same two dummy samples.

### Benefits

1. **Simpler codebase** - Remove ~70% of parsing complexity
2. **Consistent architecture** - Aligns with render command
3. **Focused responsibility** - Calibrate just runs evaluations
4. **Maintainable** - Less code, clearer purpose

### Test Requirements

#### New Test File

Create `apps/aibff/src/commands/__tests__/calibrate_render_style.test.ts` with:

**Note**: Following the project's testing card conventions, tests should be
placed in `__tests__/` folders next to the source files they test.

##### Core Function Tests

- Test `extractSamplesFromMarkdown` returns exactly two dummy samples with
  correct structure
- Test `sendToAI` returns fake response after simulated delay
- Test `calculateScore` always returns 0.85
- Test `runEvaluationWithConcurrency` respects concurrency limit
- Test `runEvaluationWithConcurrency` processes all samples
- Test `runEvaluationWithConcurrency` handles errors gracefully (returns error
  result)
- Test `runEvaluationWithConcurrency` maintains result order

##### Concurrency Control Tests

- Test Set-based queue never exceeds concurrency limit
- Test Promise.race correctly waits for first completion
- Test all promises complete before function returns
- Test concurrency=1 processes sequentially
- Test concurrency=5 processes up to 5 in parallel

##### Command Flow Tests

- Test calibrateCommand reads deck file correctly
- Test comma-separated models are parsed correctly
- Test single model doesn't add prefix to output files
- Test multiple models add model prefix to output files
- Test TOML output format generates correct structure
- Test HTML output format generates correct structure
- Test empty context objects are passed to renderDeck
- Test messages extracted from OpenAICompletionRequest

##### Error Handling Tests

- Test file read errors are handled
- Test evaluation errors included in results with notes
- Test average score calculation with mixed success/error results

##### Progress Logging Tests

- Test console logs show model being evaluated
- Test console logs show sample progress (X of Y)
- Test console logs show completion with average score

#### Tests to Update

In existing calibrate test files:

- Remove tests for removed CLI options (context-vars, filter, grader-base)
- Remove tests for deck merging functionality
- Remove tests for sample tag filtering
- Update tests to expect new CLI interface (only concurrency, model, format
  options)

### Migration Steps

1. Write tests first following TDD practices
2. Wait for renderDeck to be implemented inline in the render command file
3. Remove old parsing code and dependencies
4. Implement inline `extractSamplesFromMarkdown` that returns two dummy samples
5. Create new evaluation function with Set-based concurrency control
6. Implement stubs for `sendToAI` (returns fake response) and `calculateScore`
   (returns 0.85)
7. Simplify CLI options (remove context-vars, filter, grader-base)
8. Update main command flow to support comma-separated models and new renderDeck
   signature
9. Add error handling with try-catch blocks
10. Add progress logging with console messages
11. Ensure output formats remain compatible
12. Run tests to verify implementation

### Implementation Notes

#### Clarifications from Q&A:

1. **extractSamplesFromMarkdown** - Always returns the same two dummy samples:
   ```typescript
   function extractSamplesFromMarkdown(content: string): Sample[] {
     return [
       { id: "sample1", input: "What is 2+2?", expected: "4" },
       { id: "sample2", input: "What is 10/5?", expected: "2" },
     ];
   }
   ```

2. **Concurrency control** - Use a Set as a queue instead of Semaphore:
   ```typescript
   const activeRequests = new Set<Promise<any>>();
   // When starting a request:
   if (activeRequests.size >= concurrency) {
     await Promise.race(activeRequests);
   }
   const promise = processRequest();
   activeRequests.add(promise);
   promise.finally(() => activeRequests.delete(promise));
   ```

3. **sendToAI stub** - Returns fake responses:
   ```typescript
   async function sendToAI(messages: any[], model: string): Promise<string> {
     await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate API delay
     return "This is a fake AI response for testing";
   }
   ```

4. **calculateScore** - Always returns a fixed dummy score:
   ```typescript
   function calculateScore(response: string, expected: string): number {
     return 0.85; // Fixed score for all evaluations
   }
   ```

5. **Output types** - Create minimal new types instead of importing:
   ```typescript
   interface GraderResult {
     id: string;
     grader_score: number;
     truth_score: number;
     notes: string;
     userMessage: string;
     assistantResponse: string;
   }

   interface OutputFile {
     results: GraderResult[];
     model: string;
     timestamp: string;
   }
   ```

6. **Error handling** - Add try-catch blocks:
   ```typescript
   try {
     const response = await sendToAI(messages, model);
     // ... process response
   } catch (error) {
     console.error(`Error processing sample ${sample.id}:`, error);
     return {
       id: sample.id,
       grader_score: 0,
       truth_score: 0,
       notes: `Error: ${error.message}`,
       userMessage: sample.input,
       assistantResponse: "",
     };
   }
   ```

7. **Progress logging** - Simple console messages:
   ```typescript
   console.log(`Processing sample ${index + 1} of ${samples.length}...`);
   console.log(`Completed evaluation. Average score: ${averageScore}`);
   ```

8. **Model parameter** - Passed through but ignored in stub:
   ```typescript
   // Model is accepted as parameter but ignored in the stub implementation
   async function sendToAI(messages: any[], model: string): Promise<string> {
     // model parameter is available but not used in stub
     return "This is a fake AI response for testing";
   }
   ```

9. **Multiple models** - Accept comma-separated list via --model flag:
   ```typescript
   // CLI: aibff calibrate deck.md --model gpt-4,gpt-3.5-turbo
   const models = options.model.split(",").map((m) => m.trim());
   // Run evaluation for each model
   ```

10. **renderDeck usage** - Use renderDeck function (will be inline in render
    command):
    ```typescript
    // renderDeck is not imported, it will be available inline
    // Updated call with 4 parameters per context injection plan:
    const openAiRequest = renderDeck(
      deckText,
      context,
      extractedContext,
      openAiCompletionOptions,
    );
    const messages = openAiRequest.messages;
    ```

11. **renderDeck parameters** - Per context injection plan:
    - `deckMarkdown`: The markdown content of the deck
    - `context`: Record<string, unknown> - context values (empty object for
      calibration)
    - `extractedContext`: ExtractedContext - context definitions (empty object
      for calibration)
    - `openAiCompletionOptions`: Record<string, unknown> - OpenAI options (empty
      object for calibration)

#### Additional Notes:

- No deck merging (simplifies code significantly)
- Output formats remain unchanged to maintain compatibility
- Focus on simplicity over feature completeness
- All complex features are stubbed for initial migration

### Notes

- Sample extraction logic will eventually move to render module
- No deck merging (simplifies code significantly)
- Output formats remain unchanged to maintain compatibility
- Focus on simplicity over feature completeness
- Calibration does not use context injection - passes empty objects for context
  parameters
- renderDeck will be available from the render command implementation (not
  imported)
