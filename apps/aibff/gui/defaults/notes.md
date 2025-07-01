# Hello World Classifier Notes

This is a simple example evaluation workflow to demonstrate the aibff GUI.

## What this example does

- **Actor**: A classifier that outputs "YES" only for exactly "hello world",
  "NO" for everything else
- **Grader**: Evaluates if the actor correctly identified the input
- **Input Samples**: Various test cases including exact matches, case
  variations, and different messages

## Key learning points

1. **Case sensitivity matters** - "Hello World" ≠ "hello world"
2. **Exact matching** - "hello" alone is not "hello world"
3. **Output format** - Actor must respond with exactly "YES" or "NO"
4. **Grader scoring** - +3 for correct, 0 for invalid format, -3 for incorrect

## Next steps

You can modify any of these components to build your own evaluation workflow:

- Change the input samples to test different scenarios
- Update the actor deck to implement different logic
- Adjust the grader deck to evaluate different aspects
- Add more ground truth examples

Try running this example first to see how everything works together!
