# BfDs Creation Plan (formerly BfDs Lite)

**Date**: 2025-06-23\
**Status**: In Progress\
**Author**: Claude

## Overview

Created a new lightweight design system (bfDs) to replace the bloated legacy
design system. Starting with core components and building up incrementally.

**Note**: This was originally created as bfDsLite but has been renamed to bfDs
as part of the 2025-06-25 design system migration.

## Goals

- Create a lightweight alternative to the existing bfDs
- Reduce complexity and bundle size
- Use modern CSS practices (CSS variables, clean class naming)
- Maintain consistent design language
- Easy to extend and maintain

## Design Tokens

### Color Palette

- **Primary**: `#ffd700` (gold)
- **Background**: `#141516` (dark gray)
- **Text**: `#fafaff` (light gray)
- **Secondary**: `#6b7280` (medium gray)

### CSS Variables Structure

- Base colors with hover/active variations
- Semantic naming convention: `--bfds-{color}-{state}`

## Progress

### ✅ Completed

- [x] Created `apps/bfDsLite` directory structure
- [x] **BfDsLiteButton** component with:
  - 4 variants: primary, secondary, outline, ghost
  - 3 sizes: small, medium, large
  - Hover and active states
  - Disabled state
  - TypeScript types
  - **Icon support**: `icon`, `iconPosition`, `iconOnly` props
  - **Round icon-only buttons**: Perfectly circular design
- [x] **BfDsLiteIcon** component with:
  - 80+ icons from existing bfDs system
  - 3 sizes: small (16px), medium (20px), large (24px)
  - Color customization with CSS variable integration
  - TypeScript-safe icon names using `keyof typeof icons`
  - Searchable example component with grid layout
- [x] **BfDsLiteTabs** component with:
  - Multiple tab support with controlled/uncontrolled modes
  - **Nested subtabs** for hierarchical navigation
  - **Keyboard navigation** (arrow keys, Home/End, Enter/Space)
  - **Icon support** in both main tabs and subtabs
  - **Disabled tab states** with proper styling
  - **Smooth content transitions** with fade-in animations
  - **2 variants** (primary, secondary) and **3 sizes** (small, medium, large)
  - **Comprehensive accessibility** with ARIA attributes and roles
- [x] CSS variables system for theming
- [x] Example component pattern (`Component.Example`)
- [x] Demo page setup with Button, Icon, and Tabs examples
- [x] CSS moved to static folder (per system requirements)
- [x] Main index.ts exports
- [x] Icon library moved to `lib/icons.ts`

### 🔄 In Progress

- [ ] Documentation of component API

### 📋 Todo

- [ ] Additional core components:
  - [ ] Input/TextField
  - [ ] Select/Dropdown
  - [ ] Checkbox
  - [ ] Radio
  - [ ] Modal
  - [ ] Toast/Notification
- [ ] Layout components:
  - [ ] Container
  - [ ] Grid
  - [ ] Stack
- [ ] Form components integration
- [ ] Typography system
- [ ] Testing setup
- [ ] Integration with existing apps

## File Structure

```
apps/bfDsLite/
├── components/
│   ├── BfDsLiteButton.tsx (with .Example and icon support)
│   ├── BfDsLiteIcon.tsx (with .Example)
│   └── BfDsLiteTabs.tsx (with .Example and subtabs support)
├── lib/
│   └── icons.ts (80+ icon definitions)
├── demo/
│   └── Demo.tsx
├── memos/
│   └── plans/
│       └── 2025-06-23-bfds-lite-creation.md
└── index.ts

CSS: static/bfDsLiteStyle.css (comprehensive styling)
```

## Design Decisions

1. **CSS-in-CSS over CSS-in-JS**: Using external CSS files with CSS variables
   for better performance and easier theming
2. **Component.Example pattern**: Each component has an attached Example
   component for demos
3. **BEM-like naming**: `.bfds-lite-button--variant` for clear CSS class
   structure
4. **TypeScript-first**: Strong typing for all props and variants using
   `keyof typeof` patterns
5. **Minimal dependencies**: Keeping the design system lightweight
6. **Icon integration**: Seamless icon support in buttons with automatic sizing
   and positioning
7. **Circular icon buttons**: Icon-only buttons use `border-radius: 50%` for
   modern appearance
8. **Inline SVG icons**: Performance-optimized with no HTTP requests, using
   existing icon library

## Next Steps

1. Add more core components following the same patterns (Input, Select, Modal,
   etc.)
2. Enhance demo page with more interactive examples
3. Document component APIs comprehensively
4. Set up testing infrastructure
5. Plan migration strategy from bfDs to bfDsLite

## Recent Achievements (2025-06-23)

- ✅ **Complete icon system implemented** with 80+ icons and TypeScript safety
- ✅ **Button-icon integration** with flexible positioning and circular
  icon-only variants
- ✅ **Color override fixes** for icons using inline styles to ensure proper
  theming
- ✅ **Enhanced demo experience** with searchable icon grid and interactive
  examples
- ✅ **Advanced tab navigation system** with nested subtabs, keyboard
  navigation, and comprehensive accessibility features
- ✅ **Hierarchical UI patterns** supporting complex application layouts with
  main tabs and contextual subtabs

## Notes

- CSS files moved to static folder per system architecture
- Following existing Bolt Foundry patterns and conventions
- Maintaining compatibility with Deno/TypeScript setup
- Icon system reuses existing bfDs icon library for consistency
- All components follow the Component.Example pattern for comprehensive demos
