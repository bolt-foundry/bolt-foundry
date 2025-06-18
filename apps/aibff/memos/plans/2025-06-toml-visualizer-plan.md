# TOML Evaluation Results Visualizer Implementation Plan

## Overview

This work delivers an HTML visualization feature for the `aibff eval` command
that helps identify grader calibration issues. When evaluating graders against
ground truth, users need to quickly understand where and why their graders
disagree with expected scores. This visualizer presents evaluation results in a
color-coded, expandable table format that highlights calibration problems and
provides detailed context for debugging.

The visualization will be automatically generated alongside the TOML output,
creating a self-contained HTML file that can be viewed in any browser without
requiring a server or external dependencies.

## Goals

| Goal                        | Description                               | Success Criteria                                                      |
| --------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| Generate HTML visualization | Create HTML file alongside TOML output    | `results.html` created in output folder with proper structure         |
| Show calibration issues     | Color-code results by distance from truth | Rows colored by distance: green (0), yellow (1), orange (2), red (3+) |
| Provide sample details      | Show full context in expandable rows      | Click row to see conversation, scores, and grader reasoning           |
| Support multiple graders    | Display results for multiple graders      | Tabbed interface when multiple graders present                        |
| Summary statistics          | Show overall grader performance           | Display average distance, agreement %, bias indicator                 |

## Anti-Goals

| Anti-Goal                    | Reason                                                  |
| ---------------------------- | ------------------------------------------------------- |
| Building interactive web app | Keep it simple - static HTML only                       |
| Creating separate CLI tool   | Should integrate seamlessly into existing eval workflow |
| External CSS/JS dependencies | Ensure portability - everything inline                  |
| Real-time updates            | This is a post-evaluation report, not monitoring        |
| Complex visualizations       | Tables are sufficient for calibration analysis          |

## Technical Approach

The visualizer will modify the existing `aibff eval` command to output both TOML
and HTML files in a folder structure. The HTML will be completely self-contained
with inline styles and embedded data.

Key architectural decisions:

- Use folder-based output to keep related files together
- Generate HTML server-side during evaluation to have access to full sample data
- Embed evaluation data as JSON in a script tag for future extensibility
- Use semantic HTML5 elements (details/summary) for expandable rows
- Apply inline styles to ensure consistent rendering across environments

The implementation will follow TDD principles, writing tests first for the HTML
generation logic before implementing the actual functionality.

## Components

| Status | Component                              | Purpose                                   |
| ------ | -------------------------------------- | ----------------------------------------- |
| [ ]    | `utils/toml-to-html.ts`                | Convert evaluation results to HTML string |
| [ ]    | Modified `commands/eval.ts`            | Handle folder creation and dual output    |
| [ ]    | `__tests__/utils/toml-to-html.test.ts` | Test HTML generation logic                |
| [ ]    | Updated eval command tests             | Test folder creation and file output      |

## Technical Decisions

| Decision               | Reasoning                                             | Alternatives Considered                           |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Inline styles only     | Ensures portability and consistent rendering          | External CSS (requires additional files)          |
| HTML details/summary   | Native expandable rows without JavaScript             | JavaScript toggles (adds complexity)              |
| Folder-based output    | Keeps TOML and HTML together, allows future additions | Single HTML file with embedded TOML               |
| JSON data embedding    | Enables future interactivity without breaking changes | HTML-only (limits extensibility)                  |
| Server-side generation | Access to full evaluation context and sample data     | Client-side from TOML (would miss sample content) |

## Next Steps

| Question                                        | How to Explore                                                |
| ----------------------------------------------- | ------------------------------------------------------------- |
| How to retrieve sample content from evaluation? | Examine `runEval` function to see what data is available      |
| Best approach for tabs without JavaScript?      | Research CSS-only tab solutions or use simple section headers |
| How to handle very long notes/responses?        | Test with real data, consider truncation with "show more"     |
| Should we include timestamp in filename?        | Check how eval handles existing files                         |

## Test Plan

Following TDD workflow:

1. **HTML Structure Tests**
   - Generates valid HTML with proper head/body
   - Includes embedded JSON data
   - Creates table with correct columns

2. **Data Transformation Tests**
   - Converts TOML structure to HTML elements
   - Calculates summary statistics correctly
   - Handles missing fields gracefully

3. **Visual Styling Tests**
   - Applies correct colors based on distance
   - Inline styles are properly formatted
   - Responsive layout works

4. **Integration Tests**
   - Creates output folder when not specified
   - Uses custom folder name when provided
   - Writes both TOML and HTML files

## Example Usage

```bash
# Creates results/ folder with results.toml and results.html
aibff eval grader.deck.md

# Creates my-evaluation/ folder with results.toml and results.html  
aibff eval grader.deck.md --output my-evaluation
```
