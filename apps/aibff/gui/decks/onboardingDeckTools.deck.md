+++
[[tools]]
type = "function"
[tools.function]
name = "replaceGraderDeck"
description = "Replace the entire grader deck content"
[tools.function.parameters]
type = "object"
required = ["content"]
[tools.function.parameters.properties.content]
type = "string"
description = "The new grader deck content in markdown format"
+++

# Onboarding Deck Tools

This card defines the tool functions available to the AI assistant when helping
users build their evaluation workflows in the aibff GUI.

## replaceGraderDeck

Replaces the entire content of the grader deck tab with new markdown content.
Use this when you want to provide a complete grader deck definition based on the
user's requirements.

**Parameters:**

- `content` (string, required): The new grader deck content in markdown format

**Usage:** Call this function when you need to generate or update the complete
grader deck for the user's evaluation workflow.

## Input Samples Tools

![Input Samples Tools](tools/inputSamples.md)
