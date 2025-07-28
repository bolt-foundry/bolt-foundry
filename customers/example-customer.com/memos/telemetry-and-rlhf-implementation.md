# Invoice Extraction RLHF Implementation Memo

**Date**: 2025-07-28  
**Status**: Ready for Implementation  
**Goal**: Enable human reviewers to establish ground truth for invoice extraction samples

## Executive Summary

This memo outlines the implementation plan for integrating example-customer.com's invoice extraction pipeline with Bolt Foundry's RLHF system. The focus is on enabling human reviewers to score AI-extracted invoice data accuracy to establish ground truth for training the grader.

## Use Case

example-customer.com needs to:
1. Review AI-extracted invoice data (vendor info, line items, quantities, units)
2. Provide feedback on extraction accuracy
3. Establish ground truth data for improving the extraction model

## Integration Approach

### 1. Sample Data Structure

Based on the existing BfSample model, invoice extraction data must follow the OpenAI ChatCompletion format in the `completionData` JSON field:

```typescript
// BfSample.completionData follows simplified OpenAI-style structure:
{
  // Standard fields
  id: string; // e.g., "invoice-extract-123"
  object: "chat.completion";
  created: number; // Unix timestamp
  model: string; // e.g., "invoice-extractor-v1"
  
  // The conversation: user provides invoice, assistant extracts data
  messages: [
    {
      role: "user",
      content: "Extract data from this invoice:\n\n```\nACME CORP\nInvoice #INV-12345\nDate: 2024-01-15\n\nBill To: Example Restaurant\n123 Main St\n\nItem Description         Qty    Unit    Price\n----------------------------------------\nPremium Beef Patties    10CS   12/6oz  $450.00\n\nTotal: $1,234.56\n```"
    },
    {
      role: "assistant", 
      content: JSON.stringify({
        vendor: {
          name: "Acme Corp",
          invoiceNumber: "INV-12345",
          date: "2024-01-15",
          total: "$1,234.56"
        },
        lineItems: [{
          description: "Premium Beef Patties",
          quantity: 10,
          unit: "CS",
          unitPrice: "$45.00",
          totalPrice: "$450.00",
          // Complex unit parsing
          pack: 12,
          packUnit: "pack",
          packSize: 6,
          packSizeUnit: "oz"
        }]
      })
    }
  ],
  
  // Optional usage stats
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  
  // Model parameters
  temperature?: number;
  max_tokens?: number;
}
```

This maintains compatibility with the existing RLHF system - the invoice is provided as markdown in the user message, and the extraction is returned as JSON in the assistant message.

### 2. Single Grader Configuration

Create a simple overall accuracy grader:

```markdown
# Invoice Extraction Accuracy Grader

Evaluate the accuracy of the extracted invoice data compared to the original document.

Consider:
- Vendor information correctness
- Line item completeness
- Quantity and unit accuracy
- Price extraction correctness

Score from -3 (completely incorrect) to +3 (perfectly accurate).
```

### 3. RLHF Interface Adaptation

The RLHF interface will:
1. Use the unified RLHF component structure (RlhfSampleCard pattern)
2. Display extracted data using a responsive table format for line items
3. Show the original invoice markdown alongside extracted JSON
4. Allow reviewers to submit a single score (-3 to +3) and explanation
5. Follow the Isograph component patterns from the unified implementation
6. Require Google authentication for example-customer.com reviewers
7. Display samples in reverse chronological order (newest first)

## Implementation Steps

### Phase 1: Backend Setup
- [ ] Create invoice extraction deck at `/workspace/customers/example-customer.com/decks/invoice-extraction-rlhf.deck.md`
- [ ] Create accuracy grader at `/workspace/customers/example-customer.com/decks/graders/accuracy.deck.md`
- [ ] Define grader relationship using `deck.createTargetNode(BfGrader, {...})`
- [ ] Add `submitSample` method to BfDeck model
- [ ] Configure bolt-foundry SDK to use existing telemetry endpoint
- [ ] Add `submitFeedback` mutation to BfSampleFeedback.ts

### Phase 2: Sample Integration
- [ ] Use existing BfSample.completionData JSON field for invoice data
- [ ] Telemetry handler creates samples via deck metadata
- [ ] Link samples to deck using existing edge relationships

### Phase 3: UI Customization
- [ ] Create generic GroundTruthView component for any extraction type
- [ ] Display data in a flexible format that adapts to content structure
- [ ] Show source content (invoice markdown) alongside extracted data
- [ ] Integrate with existing RLHF feedback form


## Technical Decisions

| Decision | Choice | Rationale |
|----------|---------|-----------|
| Sample storage | Use existing BfSample.completionData JSON field | No schema changes needed |
| Sample creation | Use existing `submitSample` mutation | Already handles deck linkage |
| Feedback creation | Add new `submitFeedback` mutation | Missing but required for UI |
| Grader creation | Use `deck.createTargetNode(BfGrader)` | Follows existing patterns |
| Edge relationships | Use `BfEdge.createBetweenNodes` | Consistent with RLHF model |
| Grader count | Single grader initially | Simplifies MVP, can expand later |
| UI approach | Extend existing RLHF components | Maintains consistency |
| Ground truth storage | Human feedback serves as ground truth | Stored in BfSampleFeedback |

## File Structure

```
customers/example-customer.com/
├── decks/
│   ├── invoice-extraction-rlhf.deck.md    # New RLHF deck
│   └── graders/
│       └── accuracy.deck.md               # Single grader

apps/boltfoundry-com/
└── components/rlhf/
    └── GroundTruthView.tsx                # Generic ground truth component
```

## Success Criteria

### MVP (Current Focus)
- [ ] Reviewers can see extracted invoice data
- [ ] Reviewers can submit accuracy score (-3 to +3) with explanation for single grader
- [ ] Feedback is stored in BfSampleFeedback as ground truth for the accuracy grader
- [ ] System works with invoice data instead of conversations


## Key Implementation Details

### Creating the Deck and Grader
```typescript
// Step 1: Create deck files manually in example-customer folder
// - /workspace/customers/example-customer.com/decks/invoice-extraction-rlhf.deck.md
// - /workspace/customers/example-customer.com/decks/graders/accuracy.deck.md

// Step 2: Import deck into the system (in setup script or initialization)
import { readLocalDeck } from "@bfmono/packages/bolt-foundry/bolt-foundry.ts";

const deckPath = "/workspace/customers/example-customer.com/decks/invoice-extraction-rlhf.deck.md";
const localDeck = await readLocalDeck(deckPath);

// Create deck in database
const deck = await org.createTargetNode(BfDeck, {
  name: "Invoice Extraction Accuracy", 
  slug: "invoice-extraction-accuracy",
  content: localDeck.markdownContent,
  description: "Evaluate invoice extraction accuracy"
});

// Create grader from the deck's grader definition
const grader = await deck.createTargetNode(BfGrader, {
  graderText: "Overall extraction accuracy"
});
```

### Using Bolt Foundry SDK for Sample Collection

#### Key Integration Points

1. **SDK Telemetry Format**: The SDK sends telemetry in its own format with request/response details
2. **BfSample Storage**: BfSample accepts SDK telemetry format directly (no transformation needed)
3. **Deck Metadata**: The deck's render() method includes bfMetadata in its output that links samples to the correct deck

```typescript
// Invoice extraction service uses the bolt-foundry SDK
import { BfClient, readLocalDeck } from "@bfmono/packages/bolt-foundry/bolt-foundry.ts";

// Initialize the SDK with API key and metadata collection enabled
const client = BfClient.create({
  apiKey: "bf+example-customer-org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
  includeBfMetadata: true // Enable deck metadata collection globally
});

// Load the invoice extraction deck
const deck = await readLocalDeck("/workspace/customers/example-customer.com/decks/invoice-extraction-rlhf.deck.md");

// Render the deck with invoice data
const invoiceMarkdown = `ACME CORP
Invoice #INV-12345
Date: 2024-01-15
...`;

// The deck render includes bfMetadata in its output
const completion = deck.render({
  invoice: invoiceMarkdown
}, {
  includeBfMetadata: true // Enable metadata for this render (optional override)
});

// completion now includes:
// {
//   messages: [...],
//   tools: [...], 
//   bfMetadata: {
//     deckName: "invoice-extraction-rlhf",
//     deckPath: "/workspace/customers/example-customer.com/decks/invoice-extraction-rlhf.deck.md",
//     contextVariables: { invoice: invoiceMarkdown }
//   }
// }

// Use the SDK's wrapped fetch to call the extraction model
// This automatically captures telemetry with deck metadata
const response = await client.fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: completion.messages,
    temperature: 0.1,
    max_tokens: 1000
  })
});

// The telemetry handler automatically:
// 1. Captures the request/response in SDK telemetry format
// 2. Extracts deck metadata from the bfMetadata field (if included)
// 3. Stores telemetry data directly in BfSample.completionData
// 4. Creates a sample linked to the invoice extraction deck using bfMetadata
// 5. Sample is ready for RLHF review
```

### Example: Complete Invoice Extraction Flow
```typescript
// Complete example of invoice extraction with RLHF
import { BfClient, readLocalDeck } from "@bfmono/packages/bolt-foundry/bolt-foundry.ts";

async function extractInvoiceWithRLHF(invoiceText: string) {
  // Initialize SDK with metadata collection enabled
  const client = BfClient.create({
    apiKey: process.env.BF_API_KEY, // "bf+example-customer-org-id"
    collectorEndpoint: "https://boltfoundry.com/api/telemetry",
    includeBfMetadata: true // Enable deck metadata collection
  });

  // Load deck
  const deck = await readLocalDeck("./decks/invoice-extraction-rlhf.deck.md");
  
  // Render deck with invoice context and metadata
  const completion = deck.render({
    invoice: invoiceText
  }, {
    includeBfMetadata: true // Optional: can disable per-render
  });
  
  // completion.bfMetadata will be included in telemetry automatically

  // Call OpenAI through SDK's wrapped fetch
  const response = await client.fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: completion.messages,
      temperature: 0.1,
      max_tokens: 1000
    })
  });

  const result = await response.json();
  
  // Parse the extracted invoice data
  const extractedData = JSON.parse(result.choices[0].message.content);
  
  console.log("Invoice extracted:", extractedData);
  console.log("Sample automatically created for RLHF review");
  
  return extractedData;
}

// Usage
const invoiceMarkdown = `ACME CORP
Invoice #INV-12345  
Date: 2024-01-15

Bill To: Example Restaurant
123 Main St

Item Description         Qty    Unit    Price
----------------------------------------
Premium Beef Patties    10CS   12/6oz  $450.00
Fresh Lettuce           5CS    24ct    $125.00

Total: $575.00`;

const extracted = await extractInvoiceWithRLHF(invoiceMarkdown);
```

### Missing submitSample Method on BfDeck
```typescript
// To be added to BfDeck.ts
async submitSample(data: {
  completionData: any;
  collectionMethod: string;
  name?: string;
}): Promise<BfSample> {
  const sample = await this.createTargetNode(BfSample, data);
  
  // TODO: Trigger async grading for this sample
  
  return sample;
}
```

### Missing submitFeedback Mutation
```typescript
// To be added to BfSampleFeedback.ts
static override gqlSpec = this.defineGqlNode((gql) =>
  gql
    .mutation("submitFeedback", {
      args: (a) =>
        a
          .nonNull.string("sampleId")
          .nonNull.int("score")
          .nonNull.string("explanation"),
      returns: "BfSampleFeedback",
      resolve: async (_src, args, ctx) => {
        const cv = ctx.currentViewer;
        const sample = await BfSample.findX(cv, args.sampleId as BfGid);
        
        // Validate score range
        if (args.score < -3 || args.score > 3) {
          throw new Error("Score must be between -3 and 3");
        }
        
        const feedback = await sample.createTargetNode(BfSampleFeedback, {
          score: args.score,
          explanation: args.explanation
        });
        
        return feedback;
      }
    })
);
```

## Grader Execution

- **MVP Approach**: Manual grader execution on-demand (trigger via admin interface or CLI)
- **Future Implementation**: Worker queue system for automatic asynchronous grading
- API returns sample ID immediately without waiting for grading
- When graders are updated, re-run against all samples to:
  - Measure performance against ground truth (samples with human feedback)
  - Grade any previously ungraded samples
- Manual execution keeps MVP simple while preserving async architecture for later

## SDK Metadata Collection Enhancement Required

The bolt-foundry SDK needs to be enhanced to support bfMetadata collection:

### BfClient.create() Enhancement
```typescript
// Add includeBfMetadata option to BfClient
BfClient.create({
  apiKey: "bf+org-id",
  collectorEndpoint: "https://boltfoundry.com/api/telemetry",
  includeBfMetadata: true // Global enable/disable for metadata collection
});
```

### deck.render() Enhancement  
```typescript
// Add metadata options and include bfMetadata in render output
deck.render(params, options?: {
  includeBfMetadata?: boolean // Per-render override
}) → {
  messages: Array<{role: string, content: string}>,
  tools: Array<ToolDefinition>,
  bfMetadata?: {
    deckName: string,
    deckPath: string, 
    contextVariables: Record<string, unknown>
  }
}
```

### Telemetry Data Structure
```typescript
// The SDK's telemetry data should include bfMetadata when enabled
interface TelemetryData {
  timestamp: string;
  duration: number;
  provider: string;
  request: { url: string; method: string; headers: Record<string, string>; body: any };
  response: { status: number; headers: Record<string, string>; body: any };
  bfMetadata?: {
    deckName: string;
    deckPath: string;
    contextVariables: Record<string, unknown>;
  };
}
```

**Implementation Logic**: 
- If `BfClient.includeBfMetadata = false`, never collect metadata
- If `BfClient.includeBfMetadata = true` and `render.includeBfMetadata = false`, skip metadata for that render
- If both are true (or render option is undefined), include `completion.bfMetadata` in telemetry

## Notes

- This implementation reuses the existing RLHF infrastructure
- The key missing pieces are the `submitFeedback` mutation and SDK metadata enhancements
- BfSample accepts SDK telemetry format directly (no transformation needed)
- Invoice data fits naturally in the `completionData` JSON field  
- Single grader approach keeps MVP simple - human feedback becomes ground truth for training the accuracy grader
- Field-by-field correction and multiple graders can be added later
- Two-level metadata control (client-level and render-level) provides maximum flexibility
- Organization-scoped access control is already implemented - example-customer.com reviewers automatically see only their organization's data
- Error handling for malformed invoice extractions is handled upstream in the extraction service, not in the sample ingestion system
- Manual grader execution initially, with worker queue system planned for later implementation

## Appendix: Relevant Files and Documentation

### RLHF Core Models
- `/workspace/apps/bfDb/nodeTypes/rlhf/BfDeck.ts` - Evaluation deck model
- `/workspace/apps/bfDb/nodeTypes/rlhf/BfGrader.ts` - Grader criteria model
- `/workspace/apps/bfDb/nodeTypes/rlhf/BfSample.ts` - Sample storage with `submitSample` mutation
- `/workspace/apps/bfDb/nodeTypes/rlhf/BfSampleFeedback.ts` - Human feedback model (needs `submitFeedback` mutation)
- `/workspace/apps/bfDb/nodeTypes/rlhf/BfGraderResult.ts` - AI evaluation results

### RLHF Test Files
- `/workspace/apps/bfDb/nodeTypes/rlhf/__tests__/RlhfPipelineIntegrationTest.test.ts` - Full pipeline tests
- `/workspace/apps/bfDb/nodeTypes/rlhf/__tests__/RlhfMutations.integration.test.ts` - Mutation tests
- `/workspace/apps/bfDb/nodeTypes/rlhf/__tests__/BfSampleFeedback.test.ts` - Feedback validation tests

### Implementation Plans
- `/workspace/apps/boltfoundry-com/memos/plans/rlhf-unified-implementation.md` - Unified RLHF implementation plan
- `/workspace/customers/example-customer.com/memos/line-item-extractor-implementation-plan.md` - Invoice extraction requirements

### UI Components
- `/workspace/apps/boltfoundry-com/components/RlhfInterface.tsx` - Main RLHF interface (placeholder)
- `/workspace/apps/boltfoundry-com/components/RlhfHome.tsx` - RLHF home page
- `/workspace/apps/boltfoundry-com/entrypoints/EntrypointRlhf.ts` - RLHF route entrypoint

### Example Customer Files
- `/workspace/customers/example-customer.com/decks/line-item-json-grader.deck.md` - Existing JSON validity grader
- `/workspace/customers/example-customer.com/decks/grader-base/grader-base.deck.md` - Base grader template
- `/workspace/customers/example-customer.com/extend-pipeline.ts` - Pipeline extension script

### Demo Decks
- `/workspace/apps/bfDb/nodeTypes/rlhf/demo-decks/customer-support-demo.deck.md` - Example deck structure
- `/workspace/apps/bfDb/nodeTypes/rlhf/demo-decks/customer-support-samples.toml` - Sample data format

### Infrastructure
- `/workspace/apps/bfDb/classes/BfNode.ts` - Base node class with relationship methods
- `/workspace/apps/bfDb/nodeTypes/BfEdge.ts` - Edge class for node relationships
- `/workspace/apps/bfDb/builders/graphql/makeGqlBuilder.ts` - GraphQL mutation builder

### API Patterns
- `/workspace/apps/boltfoundry-com/apiRoutes.ts` - API route patterns using URLPattern
- `/workspace/apps/boltfoundry-com/handlers/telemetry.ts` - Example POST endpoint

### Isograph Patterns
- `/workspace/apps/boltfoundry-com/components/Home.tsx` - Example Isograph component
- `/workspace/apps/boltfoundry-com/mutations/JoinWaitlist.tsx` - Example mutation

### Documentation
- `/workspace/memos/guides/company-vision.md` - RLHF workflow vision
- `/workspace/docs/blog/2025-06-23-llm-evals-with-aibff.md` - RLHF practical guide