# Technical Implementation Planning Protocol

When creating implementation plans, focus on the technical aspects with these
guidelines:

## Reasoning First

- Begin with technical reasoning before implementation details
- Understand the "why" behind architectural decisions
- Articulate performance considerations, scalability requirements, and
  maintenance implications
- Always reason through trade-offs between approaches

## Technical Specifications

- [ ] Define clear API signatures and interfaces
- [ ] Use TypeScript type definitions to express contracts
- [ ] Include data flow diagrams for complex interactions
- [ ] Document state management approaches

### Example API Signature Format

```typescript
/**
 * Description of what the function does
 * @param userId - Description of userId parameter
 * @param options - Configuration options
 * @returns Description of return value
 */
function fetchUserData(userId: string, options?: {
  includeProfile?: boolean;
  fetchHistory?: boolean;
}): Promise<UserData>;

interface UserData {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
  history?: UserHistory[];
}
```

## Component Relationships

- Clearly define dependencies between components
- Document how data flows through the system
- Specify event handling and propagation
- Detail error handling strategies

## Implementation Versions

- Break down complex implementations into distinct technical versions
- Version numbering:
  - Use 0.0.x versions during active development
  - Graduate to 0.1, 0.2, etc. upon completion of each milestone
  - Example: Working towards v0.1 uses versions 0.0.1, 0.0.2, etc.
- Describe technical requirements for each version
- Outline testing strategies for each component

### Version Template

**Version 0.0.X: [Name]**

- **Technical Goal**: What this version accomplishes
- **Dependencies**: What must be completed first
- **Components**:
  - List of components to be modified/created
  - Technical specifications for each
- **Integration Points**:
  - How components interact
  - API contracts between them
- **Testing Strategy**:
  - Critical test cases
  - Testing approach

## Code Path References

- Reference existing code paths that will be modified
- Use relative paths to existing files
- Include frontend and backend references
- Note potential impact on connected systems

## Data Architecture

- Document database schema changes
- Define state management approach
- Specify caching strategies
- Detail data validation requirements

## No Implementation Code

- Do not include actual implementation code
- Focus on interfaces, types, and signatures
- Describe algorithms conceptually rather than in code
- Use pseudocode only when necessary for clarity

## Technical Risks & Mitigation

- Identify potential technical challenges
- Outline performance considerations
- Document security implications
- Propose mitigation strategies

## Appendix: Technical Specifications

Place detailed specifications in an appendix:

- Database schema definitions
- Complex data flow diagrams
- State machine definitions
- Algorithm descriptions

Remember: The implementation plan should provide enough technical detail to
guide development without writing the actual code. Focus on contracts,
interfaces, and architecture rather than implementation details.
