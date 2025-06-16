# Grader Base Deck

This deck represents the base evaluation framework that is automatically
injected by the makeGraderDeckBuilder function into all grader decks.

## Grader Evaluation

### Evaluation Task

- Evaluate the following AI assistant response based on the provided criteria

### Output Format

Return your evaluation as a JSON object with the following structure:

- score: number between -3 and 3 (overall score)
- reason: string explaining the overall evaluation
- Return ONLY the JSON object, no other text

Example:

```json
{
  "score": 2,
  "reason": "Good response overall but could be more concise"
}
```

## Context Variables

![grader contexts](./grader-base.deck.toml)
