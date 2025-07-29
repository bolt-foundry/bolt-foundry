# Landing Page Integration - PR 1573 Implementation Plan

**Created:** 2025-07-22\
**Status:** Planning\
**Priority:** High

## Context

We successfully fixed CSS loading and hydration issues in boltfoundry-com. Now
need to reconcile these fixes with PR 1573 changes that implement a full
marketing landing page.

### Current State

- ✅ CSS loading system working (styles/index.ts consolidation)
- ✅ Single entry point architecture (ClientRoot.tsx)
- ✅ Hydration issues resolved
- ✅ E2E tests passing
- 🔧 Simple Home.tsx with test squares (needs replacement)

### PR 1573 Changes to Integrate

- Complete Home.tsx redesign (+209/-31 lines)
- JoinWaitlist GraphQL mutation setup
- Major CSS overhaul (+711/-46 lines in index.css)
- GitHub stars integration
- Nav component integration
- Plinko game component (838 lines) - **Phase 6**

## Implementation Approach

**Strategy:** Incremental implementation with independent commits per phase

### Phase 1: Enhanced Basic Landing Page (Foundation)

**Goal:** Replace test squares with professional landing structure

**Tasks:**

- [ ] Remove test squares and debug elements from Home.tsx
- [ ] Add hero section with proper typography
- [ ] Add professional messaging and footer
- [ ] Keep existing BfDs button functionality
- [ ] Update CSS imports to remove test.css/gradient.css

**Success Criteria:**

- Professional static landing page
- No broken CSS imports
- E2E tests still pass

### Phase 2: Navigation Integration

**Goal:** Add professional navigation header

**Tasks:**

- [ ] Copy Nav.tsx from apps/boltFoundry/components/
- [ ] Adapt router context for boltfoundry-com
- [ ] Simplify nav items for marketing site
- [ ] Integrate into Home.tsx layout

**Success Criteria:**

- Working navigation header
- Consistent styling with main app

### Phase 3: GitHub Integration

**Goal:** Show GitHub star count for social proof

**Tasks:**

- [ ] Add githubRepoStats field to Home.tsx Isograph query
- [ ] Display star count in hero section
- [ ] Verify backend GraphQL support

**Success Criteria:**

- Live GitHub star count displayed
- GraphQL query working correctly

### Phase 4: Waitlist Form

**Goal:** Add email capture functionality

**Tasks:**

- [ ] Copy JoinWaitlist mutation from PR 1573
- [ ] Create form using BfDs components (BfDsForm, BfDsInput,
      BfDsFormSubmitButton)
- [ ] Implement validation and submission logic
- [ ] Add success/error states

**Success Criteria:**

- Working email capture form
- Form validation working
- Successful submission to backend

### Phase 5: Full Landing Page Styling

**Goal:** Complete visual polish

**Tasks:**

- [ ] Import enhanced CSS from PR 1573
- [ ] Add responsive design
- [ ] Implement proper spacing and typography
- [ ] Add hover effects and transitions

**Success Criteria:**

- Production-ready visual design
- Responsive across devices
- Professional polish

### Phase 6: Plinko Game Integration

**Goal:** Add interactive Plinko game component

**Tasks:**

- [ ] Copy Plinko.tsx component (838 lines) from PR 1573
- [ ] Copy associated plinko.css styles
- [ ] Integrate Plinko into Home.tsx layout
- [ ] Ensure game works with current CSS architecture
- [ ] Test interactive functionality

**Success Criteria:**

- Working Plinko game component
- Game integrates smoothly with landing page
- No performance issues or CSS conflicts

## Technical Considerations

### CSS Architecture

- Maintain current working CSS loading system
- Add new styles through styles/index.ts imports
- Preserve CSS bundling for production

### GraphQL Integration

- Use existing Isograph setup
- Copy mutation patterns from other apps
- Verify backend schema compatibility

### Component Strategy

- Leverage existing BfDs components
- Copy proven patterns from boltFoundry app
- Keep implementations simple initially

## Implementation Order

**Phases 1-5:** Core landing page functionality **Phase 6:** Interactive Plinko
game component

All features from PR 1573 will be implemented incrementally.

## Testing Strategy

- Run E2E tests after each phase
- Verify CSS loading continues working
- Test form functionality thoroughly in Phase 4
- Cross-browser testing in Phase 5

## Success Metrics

- [ ] Professional landing page replacing test implementation
- [ ] Working email capture for waitlist
- [ ] GitHub integration for social proof
- [ ] Maintained CSS loading architecture
- [ ] All E2E tests passing

## Next Steps

1. Start with Phase 1 - Foundation
2. Commit after each phase completion
3. Test thoroughly before moving to next phase
4. Document any issues or deviations

---

**Implementation Notes:**

- Focus on minimal changes per phase
- Each phase should be independently commitable
- Preserve existing working CSS architecture
- Use simple implementations over complex ones
