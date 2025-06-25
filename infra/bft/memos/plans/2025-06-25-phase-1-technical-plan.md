# BFT Phase 1 Technical Implementation Plan

## Overview

This technical plan implements Phase 1 as described in the
[BFF to BFT Rename Implementation Plan](../../memos/plans/2025-06-25-bff-to-bft-rename.md#phase-1-create-parallel-structure-with-clean-implementation).

## Phase 1 Goals

1. Create `/infra/bft/` directory alongside `/infra/bff/`
2. Create new cleanroom implementation of core files in `/infra/bft/`
3. Create `bft` executable that can load and execute `.bff.ts` files
4. Implement `--help` command
5. Ensure backward compatibility

## Implementation Details

See the main implementation plan for full details. This phase focuses
exclusively on creating a clean parallel structure that maintains 100%
compatibility with existing `.bff.ts` commands.
