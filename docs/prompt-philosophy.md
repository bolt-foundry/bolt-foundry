# Prompt Design Philosophy

The Bolt Foundry approach to prompt design emphasizes starting with a thorough,
"perfect" prompt and then iterating toward efficiency. The goal is to achieve
maximum accuracy and reliability before trimming unnecessary tokens.

## Goal

> Your initial goal should be to have an extremely expensive perfect prompt. If
> you don’t have a lot of users, a perfect accuracy, perfect reliability prompt
> will be worth more than any token savings you could accrue up front.
>
> After you’ve got a perfect setup, you can start to work backward, removing
> unnecessary parts of the setup, until you’re left with something that
> straddles the line between affordable and accurate.

## Principles

1. **Inverted pyramid, regular pyramid**: Structure the prompt so the system
   prompt remains consistent. Provide critical context via user turns and
   summarize at the end.
2. **Start with guard rails**: Typically begin with the Persona Card.
3. **Explain the process**: Use Behavior Cards to outline steps and desired
   outcomes. Include the phrase **"Your goal is"** when describing expected
   behavior.
4. **Specify the output format**.
5. **Delay output**: Remind the assistant not to respond until it has all
   necessary context and then produce the best possible answer.
6. **Seed the conversation**: Begin with an assistant turn requesting needed
   user context, followed by the user providing that context.
7. **Iterate with synthetic turns**: Continue adding assistant and user turns
   until the assistant responses closely match your Behavior Card steps.

By iteratively refining the prompt and measuring performance—even informally—you
can guide the model toward consistent behavior.

## Tips

- Speak in second person; avoid "I" or "we".
- Reuse key phrases verbatim.
- Use Markdown formatting to emphasize important details.
- Keep the system prompt large but context-light.
- Leverage synthetic conversations to drive the model toward the desired
  objective.

## Cards and Transitions

System prompts are organized as **cards** and **transitions**:

1. **Intro transition** – Overview of goals and assistant functions.
2. **Assistant Persona Card** – Defines the assistant's persona.
3. **Transition to the user persona card**.
4. **Transition to the Behavior Card** – Often includes tool calls and workflow
   details.
5. **Synthetic assistant turn** – Prepares the conversation and guides the model
   to the next step.

This structure reduces stochastic responses and keeps the assistant focused on
the expected sequence of actions.
