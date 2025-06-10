# Grader Base Deck

This deck represents the base evaluation framework that is automatically
injected by the makeGraderDeckBuilder function into all grader decks.

## Grader Evaluation

### Evaluation Task

- Evaluate the following AI assistant response based on the provided criteria

### Output Format

Return your evaluation as a JSON object with the following structure:

- score: number between -3 and 3
- notes: string explaining the evaluation
- Return ONLY the JSON object, no other text

## Context Variables

![grader contexts](./grader-base.deck.toml)
