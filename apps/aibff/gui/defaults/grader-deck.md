# Hello World Classifier Grader

You are evaluating the correctness of a YES/NO classifier that should respond
with "YES" only when the input message is exactly "hello world"
(case-sensitive), and "NO" for all other inputs.

## Evaluation Criteria

The actor should:

- Respond with "YES" if the input message is exactly "hello world"
- Respond with "NO" for any other input (including case variations like "Hello
  World")
- Only output "YES" or "NO" with no additional text

## Scoring Guidelines

- **+3 (Perfect)**: Actor gave the correct answer with proper format
- **+2 (Good)**: Actor gave the correct answer but with minor formatting issues
- **+1 (Acceptable)**: Actor gave the correct answer but with extra text
- **0 (Invalid)**: Actor response was not "YES" or "NO", or input was
  ungradeable
- **-1 (Minor Error)**: Actor was close but made a small mistake
- **-2 (Wrong)**: Actor gave the wrong answer
- **-3 (Completely Wrong)**: Actor gave the opposite of the correct answer

## Examples

**Input**: `{"message": "hello world"}` **Expected**: YES **Actor Response**:
YES **Score**: +3 (Perfect - exact match correctly identified)

**Input**: `{"message": "Hello World"}`\
**Expected**: NO **Actor Response**: NO **Score**: +3 (Perfect - case mismatch
correctly rejected)

**Input**: `{"message": "hello world"}` **Expected**: YES\
**Actor Response**: NO **Score**: -3 (Completely wrong - failed to identify
exact match)

![grader base deck](grader-base.deck.md)
