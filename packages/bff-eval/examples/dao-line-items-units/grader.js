const { makeGraderDeckBuilder } = require("@bolt-foundry/bolt-foundry");

module.exports = makeGraderDeckBuilder("line-items-units-extractor")
  .spec("Evaluates whether an assistant correctly extracts units from line items in restaurant supplier invoices")
  .card("evaluation criteria", c =>
    c.spec("The assistant must extract the exact unit for each line item from the invoice")
     .spec("Units should be returned as part of a Line Items array in JSON format")
     .spec("Each line item must have a 'Unit' field with the uppercase unit abbreviation")
     .spec("Only extract units that are explicitly shown in the invoice - do not infer or add units")
     .spec("Extract the unit associated with the quantity/ordering, not units mentioned in descriptions")
     .spec("CRITICAL: If a line item shows only a number (like '1') with no unit indicator, the Unit field MUST be null or omitted - never add 'EA' or any other unit")
  )
  .card("unit normalization", c =>
    c.spec("All units must be returned in UPPERCASE")
     .spec("Common units include: CS (case), BX (box), BG (bag), LB (pound), EA (each), PC (piece), GAL (gallon), etc.")
     .spec("Both abbreviated and full forms are acceptable: BG/BAG, BX/BOX, CS/CASE, PC/PCS/PIECE are equivalent")
  )
  .card("scoring guidelines", c =>
    c.spec("Score 3: Perfect - All units are correctly extracted and match the invoice exactly")
     .spec("Score -3: Failure - Any of these conditions: missing a unit that exists, adding a unit where none exists, or extracting an incorrect unit")
  )
  .card("important notes", c =>
    c.spec("This is a binary evaluation - only scores of 3 or -3 are valid")
     .spec("If a line item has no unit in the invoice, the Unit field should be null or omitted")
     .spec("Units in the quantity column (e.g., '1 CS') take precedence over units in descriptions (e.g., 'SUGAR (100LB)')")
     .spec("Chinese unit indicators like 箱 (CS), 包 (BG), 盒 (BX) should be mapped to their English equivalents")
  )
  .card("common mistakes to avoid", c =>
    c.spec("DO NOT add 'EA' or 'EACH' when the quantity is just a number without a unit (e.g., '1' or '5')")
     .spec("DO NOT extract units from the description when a unit exists in the quantity column")
     .spec("DO NOT guess or infer units based on the product type - only extract what is explicitly written")
     .spec("Example of WRONG extraction: Invoice shows '1 DELIVERY' → extracting Unit='EA' is INCORRECT")
     .spec("Example of CORRECT extraction: Invoice shows '1 DELIVERY' → Unit should be null or omitted")
  );