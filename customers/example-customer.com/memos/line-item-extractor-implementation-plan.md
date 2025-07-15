# Line Item Spatial Extractor Implementation Plan

## Overview

We're building a prompt system to extract structured data from restaurant
supplier invoices (PDFs and images). The extractor needs to identify vendor
information, invoice metadata, and detailed line items with multi-level unit
parsing. This builds on our existing grader but extends it to handle full
invoice extraction with pack-level unit complexity.

## Goals

| Goal                          | Success Criteria                                                     |
| ----------------------------- | -------------------------------------------------------------------- |
| Extract vendor metadata       | Accurately capture Vendor Name, Invoice Number, Date, Total          |
| Parse line items              | Extract Description, Quantity, Unit, Unit Price, Price for each item |
| Handle complex units          | Parse "12/6oz" format into pack quantity/unit and item size/unit     |
| Maintain grader compatibility | Pass existing grader tests with CT default update                    |
| Build with deck system        | Use composable cards for maintainable prompt engineering             |

## Anti-Goals

| Anti-Goal             | Why to Avoid                                       |
| --------------------- | -------------------------------------------------- |
| OCR implementation    | We're building prompts, not image processing       |
| Custom unit creation  | Stick to standard restaurant supplier units only   |
| Price calculations    | Extract only, don't compute or validate math       |
| Layout preservation   | Focus on data extraction, not spatial formatting   |
| Non-invoice documents | Specifically for restaurant supplier invoices only |

## Technical Approach

The extractor will use Bolt Foundry's deck/card/spec system to create a
composable, testable prompt. We'll structure the deck with cards for each
extraction concern: vendor identification, line item parsing, unit
normalization, and complex unit handling. The prompt will be designed to work
with LLMs that receive invoice images/PDFs and output structured JSON.

Key design decisions:

- Separate cards for each data type to allow independent testing
- Explicit examples showing pack-level unit parsing (12/6oz → quantity + unit +
  pack size + pack unit)
- Clear specification of when to use "CT" as default vs leaving null
- Samples demonstrating edge cases and correct behavior

## Components

| Component              | Description                                                                                                               | Status |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| Vendor extraction card | Extract vendor name, invoice number, date, total                                                                          | [ ]    |
| Line item parsing card | Parse Quantity, Unit, Pack, Pack Unit, Pack Size, Pack Size Unit, Unit Price, and Price                                   | [ ]    |
| Unit extraction card   | Extract and normalize units (CS, BX, BG, etc.)                                                                            | [ ]    |
| Complex unit card      | Handle format such as: 6CS 12/6oz --> 6 (quantity) CS (unit) 12 (pack) pack (pack unit) 6 (pack size) oz (pack size unit) | [ ]    |
| Output format card     | Define JSON structure for results                                                                                         | [ ]    |
| Integration tests      | Test full extraction against sample invoices                                                                              | [ ]    |

Pack, pack unit, pack size, and pack size unit can be null and may be missing at
times.

## Technical Decisions

| Decision      | Choice                                    | Rationale                                 |
| ------------- | ----------------------------------------- | ----------------------------------------- |
| Default unit  | "CT" when no unit specified               | Aligns with restaurant industry standards |
| Unit format   | Always UPPERCASE                          | Consistency with existing grader          |
| Pack parsing  | Separate pack vs item fields              | Clearer data structure for downstream use |
| Null handling | Explicit null for missing optional fields | Prevents ambiguity in data processing     |

## Next Steps

| Task                                            | Status |
| ----------------------------------------------- | ------ |
| Set up aibff deck structure                     | [ ]    |
| Create initial extraction cards                 | [ ]    |
| Test with sample spatial text files from Extend | [ ]    |
| Define JSON output schema                       | [ ]    |
| Build integration tests                         | [ ]    |
