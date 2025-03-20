1. We want to build a "identity card" which we can use to explain how we'd like
   an AI agent, model, or other thing to act.
2. The identity card is similar to anthropic's constitutional AI concept, but
   the specifics are more nuanced.
3. We'd like to take the identity card, then break it first up into sections.
   Each section, a user can add "samples" to, and for each sample the user can
   give it a rating from -3 to +3.
4. Then, after breaking down each section, we'd like to break down each
   sentence, then eventually each word.
5. After the document is thoroughly broken down, we'd then like to generate
   examples, and use another LLM to judge.
6. Eventually, we'd like to allow users to run experiments, a/b test fine tune
   runs, etc.
7. We really want to make it so that users can come close to unit testing parts
   of their AI pipelines.

repl:
https://replit.com/t/bolt-foundry/repls/joinvalleyai?replId=f18d8f1f-84c4-4a05-966b-fa4f933a1569&projectPane=false

jupyter:
https://f18d8f1f-84c4-4a05-966b-fa4f933a1569-00-358p7vq3eal1z.spock.replit.dev:3000/notebooks/content/documentation/implementationPlans/joinvalley.ai/nb.ipynb?token=bfjupyter

claude: https://claude.ai/project/5b16bbb9-2aea-4cff-a377-5f3b1ccea37e

gpt: https://chatgpt.com/g/g-p-67dc23eb278481919af35e1a00e69bdc/project

## Phase 1: Minimum Viable Implementation (Core)

### Identity Card Model - Basic Structure

**Initial Node Types:**

- `BfIdentityCard`: Basic document with text content and minimal metadata
- `BfSection`: First-level breakdown of identity card content

**Initial Edge Type:**

- `BfEdge`: Simple parent-child relationship with role property

**Implementation Steps:**

1. **Write red tests** for `BfIdentityCard` and `BfSection` basic functionality
2. Implement the nodes using the existing `BfNode`/`BfNodeInMemory` architecture
3. Create functionality to split a document into sections (without further
   granularity)

**Specifically Excluded from Phase 1:**

- Sentence/word level breakdown
- Complex metadata
- Advanced relationship types
- Rating system
- Example generation

### Basic UI for Editing

1. Simple form for creating an identity card
2. Basic section editor interface
3. Minimal styling focused on functionality

### Testing Focus

Write tests for:

- Creation and retrieval of identity cards
- Basic section breakdown
- Parent-child relationships

## Phase 2: Sample Collection & Rating

Once Phase 1 is stable and in use, add:

1. `BfSample`: Store examples to illustrate specific concepts
2. Simple -3 to +3 rating system connecting samples to sections
3. Basic view for displaying samples with their ratings

**Testing Focus:**

- Sample creation and linking to sections
- Rating storage and retrieval
- Basic aggregation of ratings

## Phase 2.25: Automatic Sample Generation

After establishing the sample framework, implement automatic generation:

1. Create `BfSampleGenerator` to produce AI responses to test inputs
2. Implement minimal prompt templating system for generating diverse samples
3. Create basic scheduling system to gradually build a corpus of samples
4. Add UI for reviewing and accepting/rejecting generated samples

**Testing Focus:**

- Sample generation quality and diversity
- Prompt template effectiveness
- Generation throughput and reliability
- Integration with existing sample storage

## Phase 2.5: Initial Fine-tuning

After collecting enough rated samples, introduce initial fine-tuning:

1. Implement data preparation pipeline to convert samples and ratings into
   fine-tuning dataset
2. Create basic evaluation metrics to measure improvement against baseline
3. Add minimal fine-tuning workflow with a single model pass
4. Implement simple A/B testing to compare original vs fine-tuned outputs

**Testing Focus:**

- Dataset preparation pipeline
- Fine-tuning workflow integration
- Evaluation metric consistency
- Simple performance comparisons

## Phase 3: Expand Hierarchical Breakdown

Only after Phases 1-2 are working in production:

1. Add `BfSentence` for next-level breakdown
2. Update UI to support viewing/editing at sentence level
3. Connect ratings to sentence level where appropriate

**Testing Focus:**

- Automated sentence detection
- Maintaining relationships between sections and sentences
- Rating propagation across levels

## Phase 4: LLM Integration

Add basic LLM integration for:

1. Automated generation of test examples
2. Simple evaluation of examples against identity card sections
3. Basic visualization of judgments

**Testing Focus:**

- LLM prompt creation
- Result parsing
- Judgment storage

## Future Phases (Based on Usage Feedback)

- Word-level breakdown
- Experimentation system
- Fine-tuning integration
- Advanced visualization

## Implementation Guidelines

### Database Structure

Start with the minimal schema required:

```typescript
type IdentityCardProps = BfNodeBaseProps & {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

type SectionProps = BfNodeBaseProps & {
  title: string;
  content: string;
  order: number;
};

type SampleProps = BfNodeBaseProps & {
  content: string;
  rating: number; // -3 to +3
};
```

### Test-Driven Development Process

Follow the TDD guidelines in AGENT.md:

1. **RED**: Write failing tests that define required behavior
2. **GREEN**: Implement minimum code to make tests pass
3. **REFACTOR**: Improve implementation while keeping tests passing

Example test approach:

```typescript
Deno.test("BfIdentityCard should break down into sections", async () => {
  const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
    import.meta,
    true,
  );

  // Create identity card
  const card = await BfIdentityCard.__DANGEROUS__createUnattached(mockCv, {
    title: "Test Identity Card",
    content:
      "# Section 1\nContent for section 1\n\n# Section 2\nContent for section 2",
  });

  // Test breakdown functionality
  await card.breakIntoSections();

  // Verify sections were created correctly
  const sections = await card.queryTargets(BfSection);
  assertEquals(sections.length, 2);
  assertEquals(sections[0].props.title, "Section 1");
  assertEquals(sections[1].props.title, "Section 2");
});
```

### Recommended Development Workflow

1. Define critical user stories for each phase
2. Create failing tests that verify those stories
3. Implement minimal code to pass tests
4. Get real user feedback as early as possible
5. Adjust next phase priorities based on feedback

## Technical Stack

Start with the minimal toolset:

- **Existing graph database** for data storage
- **Claude 3.7 for judgments** (later phases)
- **Simple React UI** for management

## Principles for Incremental Growth

1. **Start with manual processes** - automate only after understanding patterns
2. **Focus on data collection** before sophisticated analysis
3. **Expand only in response to actual user needs**
4. **Continuously refactor** to maintain simplicity
5. **Test complex processes manually** before automating them

## Model Structure Patterns

Based on the existing models in the codebase, follow these implementation
patterns:

### 1. Class Extension Hierarchy

- Extend from the appropriate base class:
  - `BfNode`: For basic database-backed nodes
  - `BfNodeInMemory`: For nodes that don't need persistent storage
  - `BfNodeBase`: For more complex nodes that need custom behavior

### 2. Method Implementation Patterns

- Override these standard methods as needed:
  - `save()`: Persist changes to the node
  - `delete()`: Remove the node
  - `load()`: Load the node data
  - `afterCreate()`: Run logic after node creation
  - `toGraphql()`: Convert to GraphQL representation

### 3. Static Helper Methods

- Implement static methods for common operations:
  - `findX()`: For custom lookups
  - `query()`: For retrieving collections of nodes
  - Factory methods with descriptive names (e.g., `createFromFolder()`)

### 4. Relationships

- Use `BfEdge` to establish relationships between nodes:
  - Store semantics in the edge's `role` property
  - Query related nodes using `queryTargets` or `BfEdge.queryTargetInstances`

By starting with this minimal implementation and growing incrementally based on
actual usage patterns, we align with the "Worse is Better" philosophy - favoring
simplicity and early delivery over theoretical completeness.
