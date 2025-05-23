# Get It Done: Project Planning Protocol

When creating project plans, follow these guidelines for a practical,
action-oriented approach:

## Start With the User (Not Your Code)

- Define clear, actionable user goals - keep it simple
- Focus on working solutions over theoretical perfection
- Frame everything as real-world user benefit
- Consider different user personas based on their jobs-to-be-done
- Prioritize concrete user journeys over feature lists

## Define Problems (Not Solutions)

- State the problem in the simplest possible terms
- Get real-world feedback rather than making assumptions
- Prioritize by actual user impact, not theoretical value
- Remember: "Dirty hands are better than clean ideas"
- Describe current state vs. desired state in concrete terms

## Scope It, Test It, Ship It

- Break work into iterative, testable versions using semantic versioning
- Version numbering:
  - During development: Use 0.0.x versions (e.g., 0.0.1, 0.0.2)
  - Upon completion: Graduate to 0.1 (first complete version)
  - Further releases: 0.2, 0.3, etc.
  - Example: Work towards v0.1 uses v0.0.x, work towards v0.2 uses v0.1.x
- Define what makes a Minimum Lovable Product (MLP)
- Use active voice for all scope definitions
- Clearly state what's out of scope
- Embrace "Worse is Better" - simplicity beats completeness

## Build User Journeys

- Create specific scenarios that can be tested
- "Tests define behavior, not implementation"
- Identify emotional and functional needs at each step
- Skip abstract descriptions - use specific examples

## Measure What Works (Not What Looks Good)

- Define how success will be tested in the real world
- Set up measurable metrics tied to user outcomes
- Plan for actual user feedback
- Include metrics showing business impact
- Remember: "Done is the engine of more"

## Test the Risks

- Identify practical risks that can be tested and fixed
- Consider accessibility, inclusivity, and ethical issues
- Document market risks from the user's perspective
- Plan for potential problems with clear fixes
- Value adaptability over perfect risk prediction

## Talk Straight (Skip the Corporate Speak)

- Use direct, straightforward language - no jargon
- Create user-centered plans that prompt action
- Set up regular test-driven feedback loops
- Plan for iterative reviews based on working code
- Develop ways to get and use real user feedback

## Show, Don't Tell

- Use visual storytelling with concrete examples
- Include direct user quotes where available
- Organize from high-level goals to specific tests
- Avoid technical jargon and implementation details

The project plan should enable quick action and iteration, focusing on user
needs that can be tested and verified. It should reflect our belief that
"Failure counts as done" and that quick cycles of improvement beat big-bang
releases. Working code in users' hands is better than perfect code in
development. When in doubt, ship it and iterate based on feedback.

Note: Project stages should be referred to as "versions" rather than "phases"
and follow semantic versioning principles. Use 0.0.x versions during development
towards a milestone, then graduate to the milestone version (0.1, 0.2, etc.)
upon completion.
