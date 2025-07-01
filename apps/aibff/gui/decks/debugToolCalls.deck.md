# Debug Tool Calls

This card defines special debug command behavior for the AI assistant. When
users need to directly execute tool calls for debugging purposes, this card
provides the pattern recognition and execution logic.

## Debug Command Pattern

**CRITICAL**: When the user types `⚡debug⚡ toolName [additional text]`, you
MUST immediately execute the tool call. This is a direct command for debugging.

**Required Actions:**

1. **Acknowledge debug mode**: Immediately respond with "🔧 Debug: executing
   [toolName] with..."
2. **Parse the command**: Extract the tool name and any additional text
3. **Map parameters intelligently**: Use the additional text to populate the
   tool's expected parameters automatically
4. **EXECUTE THE TOOL IMMEDIATELY**: Call the specified tool function with the
   mapped parameters - DO NOT ASK FOR CONFIRMATION
5. **Show results**: Display the tool's output and any relevant feedback

**Important**: This is a debugging command that requires immediate tool
execution. Do not treat this as a regular conversation - execute the tool call
in the same response where you acknowledge the debug command.

## Behavior Guidelines

- **Work with any available tool**: This debug functionality should work with
  any tool the LLM has access to
- **Intelligent parameter mapping**: Attempt to map the provided text to the
  tool's expected parameters based on the tool's schema
- **Clear feedback**: Always acknowledge when entering debug mode and what
  action is being taken
- **Error handling**: If parameter mapping fails or the tool doesn't exist,
  provide clear error messages
- **No confirmation required**: Execute immediately - this is for debugging, not
  production use

## Example Usage

```
User: ⚡debug⚡ replaceGraderDeck ## My Test Deck\nThis is test content
AI: 🔧 Debug: executing replaceGraderDeck with provided deck content...
[AI immediately calls replaceGraderDeck tool with content parameter]
[Tool executes and shows results]
```

**Critical Implementation**: When you see `⚡debug⚡`, you must:

1. Parse the command immediately
2. Acknowledge with debug message
3. **ACTUALLY INVOKE THE FUNCTION CALL** - Use the tool calling mechanism to
   execute the function
4. Show the tool results from the actual function execution

**IMPORTANT**: Do not simulate or describe the tool call - you must actually
invoke the function using the available tool calling system. The tool call must
appear in your response as an actual function invocation, not as descriptive
text.

**Function Calling Requirement**: When processing a debug command, you MUST use
the actual function calling mechanism (tool_calls) to invoke the specified
function. Do not just say you're calling it - actually call it.

## Implementation Notes

- Parse the command by splitting on whitespace after `⚡debug⚡`
- First token after debug command is the tool name
- Remaining text should be intelligently mapped to tool parameters
- Handle edge cases where tool name doesn't exist or parameters can't be mapped
