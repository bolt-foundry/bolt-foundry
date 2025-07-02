+++
[[tools]]
type = "function"
[tools.function]
name = "replaceFileContent"
description = "Replace the content of a file at the specified path"
[tools.function.parameters]
type = "object"
required = ["path", "content"]
[tools.function.parameters.properties.path]
type = "string"
description = "The file path to update (e.g., 'grader-deck', 'input-samples', 'ground-truth')"
[tools.function.parameters.properties.content]
type = "string"
description = "The new file content in the appropriate format (usually markdown)"
+++

# Onboarding Deck Tools

This card defines the tool functions available to the AI assistant when helping
users build their evaluation workflows in the aibff GUI.

## replaceFileContent

Replaces the content of a file at the specified path with new content. Use this
when you want to update any file in the workspace based on the user's
requirements.

**Parameters:**

- `path` (string, required): The file path to update (any valid file path)
- `content` (string, required): The new file content in the appropriate format

**Usage:** Call this function when you need to generate or update file content
in the workspace. The `grader-deck` path will also update the UI display.
