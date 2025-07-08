# AIBFF GUI - bfDs Component Migration Plan
*Date: 2025-07-08*

## Overview

This plan outlines the migration of AIBFF GUI components to use the Bolt Foundry Design System (bfDs) components, replacing custom UI elements with standardized, accessible, and maintainable components.

## Current State

**bfDs Components Available:** 16 total components
- Form: BfDsInput, BfDsTextArea, BfDsSelect, BfDsCheckbox, BfDsRadio, BfDsToggle, BfDsForm, BfDsFormSubmitButton
- UI: BfDsButton, BfDsCallout, BfDsIcon, BfDsList/BfDsListItem, BfDsTabs, BfDsToast/BfDsToastProvider

**Currently Used:** 2 components (13% adoption)
- BfDsButton (20+ instances across 5 components)
- BfDsCallout (recently added to GraderEditor)

## Migration Strategy

### Phase 1: Foundation Components
**Priority: High Impact, Low Risk**

#### 1.1 Replace WorkflowTextArea Component
- **Target**: `/src/components/WorkflowTextArea.tsx`
- **Replacement**: `BfDsTextArea`
- **Impact**: 6 components immediately standardized
- **Affected Components**:
  - ActorDeckTab.tsx
  - GraderDeckTab.tsx 
  - GroundTruthTab.tsx
  - InputSamplesTab.tsx
  - NotesTab.tsx
  - WorkflowPanel.tsx

#### 1.2 Replace Custom TextAreas
- **Target**: Custom textarea elements in:
  - GraderEditor.tsx (lines 124-144)
  - MessageInput.tsx (lines 60-83)
- **Replacement**: `BfDsTextArea`
- **Benefits**: Consistent validation states, accessibility

### Phase 2: UI Enhancement
**Priority: Medium Impact, Visual Improvement**

#### 2.1 Replace Status Messages
- **Target**: ChatWithIsograph.tsx
  - Loading state (lines 372-386) → `BfDsCallout` variant="info"
  - Error state (lines 388-432) → `BfDsCallout` variant="error"
- **Target**: ConversationDisplay.tsx
  - "No conversations" message → `BfDsCallout` variant="info"

#### 2.2 Replace Custom Buttons
- **Target**: Various custom styled buttons
  - ChatWithIsograph header link → `BfDsButton` variant="secondary"
  - WorkflowPanel accordion buttons → `BfDsButton` variant="ghost"
- **Benefits**: Consistent styling, accessibility

### Phase 3: Advanced Components
**Priority: High Impact, Complex Changes**

#### 3.1 Replace WorkflowPanel Accordion
- **Target**: WorkflowPanel.tsx accordion system
- **Replacement**: `BfDsTabs`
- **Benefits**: Better UX, standardized interaction patterns
- **Considerations**: May require UX review for behavior changes

#### 3.2 Replace ConversationDisplay Lists
- **Target**: ConversationDisplay.tsx custom `<ul>` elements
- **Replacement**: `BfDsList` + `BfDsListItem`
- **Benefits**: Consistent list styling, expandable content support

### Phase 4: Form Integration
**Priority: Medium Impact, Architecture Improvement**

#### 4.1 Add Form Wrappers
- **Target**: Components with multiple form fields
- **Replacement**: Wrap with `BfDsForm`
- **Benefits**: Centralized form state, better validation
- **Candidates**:
  - GraderEditor.tsx
  - MessageInput.tsx
  - WorkflowPanel.tsx sections

#### 4.2 Replace WorkflowTabButton System
- **Target**: WorkflowTabButton.tsx + custom tab logic
- **Replacement**: `BfDsTabs` system
- **Benefits**: Standardized tab behavior, accessibility

### Phase 5: Polish & Icons
**Priority: Low Impact, Visual Polish**

#### 5.1 Add Icons
- **Target**: Visual indicators throughout the app
- **Replacement**: `BfDsIcon` from 50+ icon library
- **Candidates**:
  - Language indicators in CodeBlockWithAction
  - Dropdown arrows in WorkflowPanel
  - Status indicators

#### 5.2 Add Toast Notifications
- **Target**: Future enhancement
- **Implementation**: `BfDsToastProvider` + `useBfDsToast` hook
- **Benefits**: Consistent notification system

## Technical Considerations

### Dependencies
- All bfDs components already available via `@bfmono/apps/bfDs/components/`
- No additional dependencies required

### Type Safety
- All bfDs components include full TypeScript interfaces
- Migration will improve type safety across the application

### Styling
- bfDs components use consistent theming
- Custom styles will be reduced significantly
- CSS custom properties for theming integration

### Testing
- Each phase should include component testing
- Visual regression testing recommended
- Accessibility testing with updated components

### Performance
- bfDs components are optimized for performance
- Reduction in custom CSS will improve bundle size
- Form state management improvements

## Success Metrics

### Quantitative
- **Code Reduction**: ~85% reduction in custom UI code
- **Component Usage**: From 13% to 80%+ bfDs adoption
- **Consistency**: Standardized UI patterns across application

### Qualitative
- **Developer Experience**: Faster feature development
- **Accessibility**: Improved keyboard navigation and screen reader support
- **Maintainability**: Centralized component updates
- **User Experience**: Consistent interaction patterns

## Risk Assessment

### Low Risk
- Phase 1 (WorkflowTextArea replacement) - Direct API compatibility
- Status message replacements - Additive changes

### Medium Risk
- WorkflowPanel accordion → BfDsTabs - Behavior changes
- Form integration - State management changes

### High Risk
- WorkflowTabButton system replacement - Complex state logic

## Implementation Notes

### Code Standards
- Follow existing import patterns: `import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx"`
- Maintain TypeScript array syntax: `Array<T>` not `T[]`
- Use `bft test` for testing throughout migration

### Rollback Strategy
- Each phase can be independently rolled back
- Keep original components until migration is verified
- Feature flags for gradual rollout if needed

### Documentation
- Update component documentation as migration progresses
- Create migration guide for future similar projects
- Document any custom styling requirements

## Next Steps

1. Begin Phase 1 with WorkflowTextArea replacement
2. Establish visual regression testing
3. Verify all bfDs components work in aibff context
4. Review Phase 3 changes with design team

## Conclusion

This migration will significantly improve the AIBFF GUI's consistency, accessibility, and maintainability while reducing custom code by ~85%. The phased approach minimizes risk while delivering incremental value throughout the process.