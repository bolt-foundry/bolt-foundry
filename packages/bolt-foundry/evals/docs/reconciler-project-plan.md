# Eval Reconciler Feature - Project Plan

## Overview

Add a "reconcile" option to the evals API that analyzes how well a judge's evaluation notes align with the original evaluation criteria specified in the judge deck.

## Motivation

When judges evaluate samples, they produce scores and notes explaining their reasoning. However, there's currently no automated way to verify whether the judge's notes actually address all the evaluation criteria defined in the spec. This reconciliation feature would:

1. Ensure judges are following the specified evaluation criteria
2. Identify gaps where judges miss important criteria
3. Highlight when judges consider factors outside the original spec
4. Provide quality metrics for judge performance

## User Stories

1. **As an eval designer**, I want to verify that my judge is addressing all specified criteria so I can ensure comprehensive evaluations.

2. **As a developer**, I want to identify when judges are missing criteria so I can improve the judge prompts.

3. **As a quality engineer**, I want metrics on how well judges follow specifications so I can track judge reliability.

## Technical Design

### 1. API Changes

#### EvalOptions Interface Extension
```typescript
export interface EvalOptions {
  inputFile: string;
  deckFile: string;
  model: string;
  reconcile?: boolean;  // New optional flag
  reconcileModel?: string;  // Optional: different model for reconciliation
}
```

#### JudgementResult Interface Extension
```typescript
export interface JudgementResult {
  // ... existing fields ...
  reconciliation?: {
    specCriteria: string[];      // Extracted criteria from deck
    coverageScore: number;       // 0-1 score of criteria coverage
    missingCriteria: string[];   // Criteria not addressed
    additionalPoints: string[];  // Points raised beyond spec
    alignment: 'high' | 'medium' | 'low';  // Overall assessment
    details?: {                  // Optional detailed analysis
      criterionAnalysis: Array<{
        criterion: string;
        addressed: boolean;
        evidence?: string;       // Quote from notes
      }>;
    };
  };
}
```

### 2. Implementation Phases

#### Phase 1: Basic Keyword Matching (MVP)
- Extract criteria from judge deck specs
- Use keyword/phrase matching to check coverage
- Calculate simple metrics
- No additional LLM calls required

#### Phase 2: Semantic Analysis with LLM
- Use LLM to analyze semantic alignment
- Extract evidence quotes from notes
- Identify implicit coverage of criteria
- Detect additional evaluation factors

#### Phase 3: Advanced Features
- Support for weighted criteria importance
- Multi-judge reconciliation comparison
- Trend analysis across evaluation runs
- Configurable reconciliation strategies

### 3. Component Architecture

```
packages/bolt-foundry/evals/
├── eval.ts                    # Main eval runner (modified)
├── reconciler.ts              # New reconciliation module
├── criteriaExtractor.ts       # Extract criteria from decks
├── coverageAnalyzer.ts        # Analyze note coverage
└── __tests__/
    ├── reconciler.test.ts
    └── criteriaExtractor.test.ts
```

### 4. Reconciliation Strategies

#### Strategy 1: Rule-Based Analysis
```typescript
interface RuleBasedStrategy {
  type: 'rule-based';
  rules: Array<{
    pattern: RegExp;
    criterion: string;
    weight?: number;
  }>;
}
```

#### Strategy 2: LLM-Powered Analysis
```typescript
interface LLMStrategy {
  type: 'llm';
  model: string;
  promptTemplate?: string;
  temperature?: number;
}
```

#### Strategy 3: Hybrid Approach
- Start with rule-based for speed
- Fall back to LLM for ambiguous cases
- Cache results for efficiency

## Implementation Plan

### Week 1: Foundation
1. Design and document interfaces
2. Implement criteria extraction from judge decks
3. Create basic reconciler module structure
4. Write comprehensive tests for extraction

### Week 2: MVP Implementation
1. Implement keyword-based coverage analyzer
2. Integrate reconciler into eval.ts
3. Add reconciliation results to output
4. Test with example judge decks

### Week 3: Enhancement
1. Add LLM-based semantic analysis option
2. Implement evidence extraction
3. Create detailed criterion analysis
4. Performance optimization

### Week 4: Polish and Documentation
1. Add comprehensive documentation
2. Create example reconciliation reports
3. Build visualization tools for results
4. Integration with existing eval workflows

## Example Usage

### Basic Usage
```bash
# Run eval with reconciliation
bff eval \
  --input samples.jsonl \
  --deck judge-clarity.ts \
  --model claude-3-opus \
  --reconcile
```

### Advanced Usage
```bash
# Use different model for reconciliation
bff eval \
  --input samples.jsonl \
  --deck judge-clarity.ts \
  --model gpt-4 \
  --reconcile \
  --reconcile-model claude-3-opus
```

### Output Example
```json
{
  "id": "eval-1",
  "score": 2,
  "output": {
    "score": 2,
    "notes": "The response is clear and addresses the user's question about API usage..."
  },
  "reconciliation": {
    "specCriteria": [
      "Evaluate clarity of explanation",
      "Check technical accuracy",
      "Assess completeness of answer"
    ],
    "coverageScore": 0.67,
    "missingCriteria": ["Assess completeness of answer"],
    "additionalPoints": ["Mentioned code examples quality"],
    "alignment": "medium"
  }
}
```

## Success Metrics

1. **Coverage Rate**: % of evaluations where all criteria are addressed
2. **Alignment Score**: Average alignment across evaluation runs
3. **Detection Rate**: % of missing criteria successfully identified
4. **Performance Impact**: Reconciliation overhead < 20% of eval time

## Risks and Mitigations

### Risk 1: Performance Impact
**Mitigation**: Implement caching, make reconciliation optional, use fast keyword matching for MVP

### Risk 2: Criteria Extraction Accuracy
**Mitigation**: Clear conventions for deck specs, manual verification options, iterative improvement

### Risk 3: False Positives/Negatives
**Mitigation**: Adjustable sensitivity settings, human review workflow, continuous tuning

## Future Enhancements

1. **Visual Dashboard**: Web UI for reconciliation results
2. **Batch Analysis**: Reconcile multiple eval runs together
3. **Judge Training**: Use reconciliation data to improve judge prompts
4. **API Integration**: REST API for reconciliation as a service
5. **Custom Strategies**: Plugin system for reconciliation strategies

## Questions to Resolve

1. Should reconciliation be synchronous or allow async processing?
2. What level of detail should be included by default vs opt-in?
3. How to handle multi-criteria that are intentionally combined?
4. Should we support partial credit for criteria coverage?
5. How to version reconciliation strategies for reproducibility?

## Next Steps

1. Review and approve project plan
2. Create detailed technical design docs
3. Set up development branch and test infrastructure
4. Begin Phase 1 implementation