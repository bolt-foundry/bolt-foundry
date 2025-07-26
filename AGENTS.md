# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

Context
I am a solo developer working on personal/small projects

This is NOT an enterprise-level project

I prefer simple, direct solutions over "best practices"

I'm a vibe coder who values shipping over perfect architecture

Default Approach
Always assume this is a POC (Proof of Concept) unless explicitly told otherwise

Keep it simple and direct - don't overthink it

Start with the most obvious solution that works

No frameworks unless absolutely necessary

Prefer single files over multiple files when reasonable

Hardcode reasonable defaults instead of building configuration systems

What NOT to do
Don't add abstractions until we actually need them

Don't build for imaginary future requirements

Don't add complex error handling for edge cases that probably won't happen

Don't suggest design patterns unless the problem actually requires them

Don't optimize prematurely

Don't add configuration for things that rarely change

Transition Guidelines
If the POC works and needs to become more robust:

Add basic error handling (try/catch, input validation)

Improve user-facing messages

Extract functions only for readability, not for "reusability"

Keep the same simple approach - just make it more reliable

Language to Use
"Quick POC to test if this works"

"Throwaway prototype"

"Just make it work"

"The dumbest thing that works"

"Keep it simple and direct"

When in Doubt
Ask: "Would copy-pasting this code be simpler than making it generic?" If yes, copy-paste it. 
