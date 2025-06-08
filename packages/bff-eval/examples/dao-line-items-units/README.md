# Line Items Units Extractor Grader

This grader evaluates whether an AI assistant can correctly extract units from line items in restaurant supplier invoices.

## What It Tests

The grader checks if the assistant can:
- Extract the exact unit abbreviation for each line item (CS, BG, LB, etc.)
- Return units in UPPERCASE format
- Only extract units that explicitly exist in the invoice
- Avoid adding units where none exist
- Extract units from the quantity column, not from descriptions

## Scoring

- **Score 3**: Perfect extraction - all units correctly identified
- **Score -3**: Failure - any missing, incorrect, or falsely added units

## Unit Normalization

The grader accepts both abbreviated and full forms as equivalent:
- BG = BAG
- BX = BOX  
- CS = CASE
- PC = PCS = PIECE
- LB = POUND
- EA = EACH
- GAL = GALLON

## Important Rules

1. Extract units from the quantity column (e.g., "1 CS"), not from descriptions
2. Chinese units (箱, 包, 盒) should be mapped to English equivalents
3. If no unit exists for a line item, return null or omit the Unit field
4. All units must be returned in UPPERCASE

## Example

Input:
```
| Quantity | Description |
| 1 箱CS | FISH SAUCE (12x24oz) |
| 5 磅LB | CHINESE EGGPLANT (LB) |
| 1 | DELIVERY |
```

Expected output:
```json
{
  "Line Items": [
    {"Unit": "CS", "Description": "FISH SAUCE (12x24oz)"},
    {"Unit": "LB", "Description": "CHINESE EGGPLANT (LB)"},
    {"Unit": null, "Description": "DELIVERY"}
  ]
}
```