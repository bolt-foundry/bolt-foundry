# eval.builders v0.1 Project Specification

## What are we building?

We're building eval.builders, a web tool that lets developers create custom
graders for LLM outputs through examples. Users paste in a markdown table with
examples of user inputs, assistant responses, and scores (-3 to +3), and the
system generates a TypeScript grader that can evaluate similar interactions. The
tool allows iterative refinement - users can test their grader immediately, see
results, adjust their examples or grader logic, and repeat until they're
satisfied. Once ready, they can download everything to run locally with the
bft-eval framework.

Think of it as a grader generator - you show it what good and bad look like
through examples, and it creates evaluation logic that can judge new outputs by
those standards.

## Why do we need to build it?

Creating reliable evaluation criteria for LLM outputs is hard. Developers often
struggle to translate their intuitive sense of "good" vs "bad" responses into
executable code. Current approaches require:

- Writing grader logic from scratch
- Understanding evaluation frameworks deeply
- Lots of trial and error to get criteria right

eval.builders solves this by:

- Learning from examples instead of requiring explicit rules
- Providing immediate feedback on grader performance
- Making the iteration cycle fast and visual
- Generating production-ready code that integrates with existing tools

This accelerates the path from "I know it when I see it" to "I have automated
evaluation."

## Status

| Task                  | Status   | Description                                  |
| --------------------- | -------- | -------------------------------------------- |
| Discovery             | Complete | Understood requirements through conversation |
| Tech stack decision   | Complete | Using main Bolt Foundry stack                |
| MVP scope             | Defined  | Grader generation only, no synthetic data    |
| Architecture planning | Pending  | Component design needed                      |

## Versions

| Version | Status   | Description                                      |
| ------- | -------- | ------------------------------------------------ |
| v0.1    | Planning | Basic grader generation from examples            |
| v0.2    | Future   | Synthetic data generation (20, then 100 samples) |
| v0.3    | Future   | Prompt optimization from validated dataset       |
| v1.0    | Future   | Full evaluation pipeline with team features      |

## Technical Approach

eval.builders will be a new app in the Bolt Foundry monorepo at
`apps/eval.builders/`, using:

- **React** for the UI (following boltFoundry patterns)
- **GraphQL** for API layer
- **bfDs** for UI components
- **packages/bft-eval** as the evaluation runtime
- **LLM integration** for analyzing examples and generating graders
- **No persistence** - everything happens in-memory/client-side

The core flow:

1. Parse markdown table input
2. Analyze examples to infer evaluation criteria
3. Generate TypeScript grader following bft-eval patterns
4. Execute grader against provided examples
5. Allow iterative refinement
6. Package for download with curl command

## Core Components

| Component         | Purpose                                                          |
| ----------------- | ---------------------------------------------------------------- |
| Example Input UI  | Textarea for pipe-delimited values with validation               |
| Grader Generator  | LLM-powered analysis and code generation                         |
| Grader Editor     | Syntax-highlighted TypeScript editor                             |
| Evaluation Runner | Execute grader in-browser against examples                       |
| Results Display   | Show scores and reasoning for each example                       |
| Download Packager | Create gzip with binary + eval folder (grader.ts, samples.jsonl) |

## User Flow (MVP)

1. **Input Examples**
   - Paste pipe-delimited values with columns: userInput | assistantResponse |
     score | description (optional)
   - Header row optional - if missing, assume first row is data
   - Scores range from -3 (anti-example) to +3 (great example)
   - Description column can explain why this example has this score
   - Optional: Add guidance text about what to evaluate

2. **Generate Grader**
   - System analyzes examples to understand patterns
   - Generates TypeScript grader in bff-eval format
   - Shows generated code in editor

3. **Test and Iterate**
   - Run grader against provided examples
   - See scores and reasoning for each
   - Edit examples, guidance, or grader code
   - Re-run until satisfied

4. **Download**
   - Get curl command that downloads a gzip file
   - Gzip contains:
     - The bft-eval binary
     - `eval/` folder with:
       - `grader.ts` - The generated grader
       - `samples.jsonl` - The example data
   - Extract and run locally with the included binary

## Data Model

```typescript
// Example input format
interface ExampleRow {
  userInput: string;
  assistantResponse: string;
  score: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  description?: string; // Optional explanation for the score
}

// No session storage - everything is ephemeral
```

## Integration Points

| System           | Integration Type | Purpose                               |
| ---------------- | ---------------- | ------------------------------------- |
| bft-eval package | Code generation  | Generate compatible graders           |
| LLM API          | Analysis         | Understand examples and generate code |
| CDN/Storage      | File hosting     | Serve downloadable packages           |

## Success Criteria

- User can go from examples to working grader in under 5 minutes
- Generated graders accurately reflect the provided examples
- Iteration cycle (edit → test → see results) takes seconds
- Downloaded grader runs identically to web version
- Code quality matches hand-written graders

## Anti-Goals

| Anti-Goal                   | Reason                                 |
| --------------------------- | -------------------------------------- |
| Complex evaluation logic UI | Keep it simple - examples speak louder |
| Multiple grader types       | Focus on one pattern that works        |
| Team collaboration          | Single-user tool for now               |
| Grader marketplace          | Solve individual problem first         |

## Next Steps

| Task                 | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| Create app structure | Set up apps/eval.builders with standard layout                |
| Design parser        | Handle pipe-delimited format with optional headers            |
| Build example UI     | Textarea input with validation                                |
| Integrate LLM        | Connect to API for grader generation                          |
| Implement runner     | Execute TypeScript graders in browser                         |
| Create download flow | Package binary + eval folder into gzip, generate curl command |

## Open Questions

| Question                          | Impact                        |
| --------------------------------- | ----------------------------- |
| How to handle malformed examples? | Affects UX and error handling |
| What LLM model/prompts work best? | Core to grader quality        |
| How to sandbox grader execution?  | Security consideration        |

## Measurement

| Metric               | Purpose            | Target                  |
| -------------------- | ------------------ | ----------------------- |
| Time to first grader | Ease of use        | < 5 minutes             |
| Grader accuracy      | Quality            | 90%+ match user intent  |
| Iteration cycles     | Tool effectiveness | 3-5 before satisfaction |
| Download completions | Real usage         | 50% of sessions         |

## Example Input Tables

### Example 1: Professional Tone Checker (with markdown header separator)

```
|userInput|assistantResponse|score|description|
|---------|-----------------|-----|-----------|
|Write a professional email declining a job offer|Thank you for the opportunity. After careful consideration, I have decided to pursue another path that better aligns with my career goals. I appreciate your time and wish your team continued success.|3|Perfect professional tone, gracious and clear|
|I need to tell my boss I'm quitting|Yo boss, I'm out. Found something better. Peace!|-3|Too casual and disrespectful for workplace|
|How do I ask for a raise?|I believe my contributions over the past year warrant a salary review. Could we schedule time to discuss my compensation based on my expanded responsibilities and market rates?|2|Good professional approach, could be more specific|
|Cancel my meeting with the client|I'll need to reschedule our upcoming meeting. Please let me know your availability for next week, and I apologize for any inconvenience.|-1|Missing context about why, seems abrupt|
|Request vacation time|I would like to request PTO from March 15-22. I've ensured all projects will be covered and will brief the team before leaving.|3|Professional, proactive about coverage|
```

### Example 2: Code Review Helper (no header, all descriptions)

```
|Fix this bug in my code|Here's the issue: you have a null pointer on line 23. Add a null check before accessing the property.|2|Good technical explanation but could include example|
|Why doesn't my function work|Your recursion has no base case, causing infinite loops. Add a termination condition when n <= 0.|3|Clear problem identification and solution|
|Make this code faster|Just use a hashmap bro|-3|Unprofessional and lacks explanation|
|Optimize this algorithm|Consider using dynamic programming to cache intermediate results, reducing time complexity from O(n²) to O(n).|3|Excellent technical detail with complexity analysis|
|Debug this error|Can you share the error message and relevant code? I'll need more context to help effectively.|1|Asks for info but doesn't try to help with common causes|
```

### Example 3: Customer Support Bot (header row, mixed descriptions)

```
|userInput|assistantResponse|score|description|
|I want a refund|I understand your frustration. Let me help you with the refund process. Can you provide your order number?|3|Clear, helpful, and empathetic|
|This product sucks|I'm sorry to hear you're having issues. Could you tell me more about what's not working so I can help?|2|Good de-escalation but could be warmer|
|WHERE IS MY ORDER???|Your order shipped yesterday and should arrive by Friday. Here's your tracking number: XYZ123.|1|Answered but didn't acknowledge frustration|
|The app keeps crashing|That's frustrating! Let's troubleshoot: 1) Update to latest version 2) Clear cache 3) Reinstall if needed. Does this help?|3|Empathetic and actionable|
|Fix this NOW|Whatever, figure it out yourself|-3|Completely unhelpful and rude|
```

### Example 4: API Documentation Helper (no descriptions for some rows)

```
|userInput|assistantResponse|score|description|
|How do I authenticate?|Use Bearer token authentication. Include `Authorization: Bearer YOUR_TOKEN` in request headers.|3|
|What's the rate limit?|The API allows 1000 requests per hour per API key. Headers show remaining quota.|2|Could mention rate limit headers|
|List all endpoints|Check our docs at api.example.com/docs|-2|Lazy response, should list main endpoints|
|Handle 429 errors|Implement exponential backoff: wait 2^n seconds where n is retry attempt. Max 5 retries.|3|Best practice recommendation|
|Why am I getting 403?|A 403 means forbidden. Check: 1) Valid API key 2) Correct permissions 3) Resource access rights|2|
```
