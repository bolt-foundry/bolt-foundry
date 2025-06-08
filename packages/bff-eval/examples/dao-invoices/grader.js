const { makeGraderDeckBuilder } = require("@bolt-foundry/bolt-foundry");

module.exports = makeGraderDeckBuilder("invoice-number-extractor")
  .spec("Evaluates whether an assistant correctly extracts invoice numbers from restaurant supplier invoices")
  .card("evaluation criteria", c =>
    c.spec("The assistant must extract the exact invoice number from the document")
     .spec("The invoice number should be returned in JSON format with the key 'invoice_number'")
     .spec("Only the actual invoice number should be extracted, not PO numbers, reference numbers, or other identifiers")
     .spec("The extracted invoice number must match exactly - no missing or extra characters")
  )
  .card("scoring guidelines", c =>
    c.spec("Score 3: Perfect - The assistant correctly extracts the exact invoice number")
     .spec("Score -3: Failure - The assistant extracts an incorrect number, no number, or any other identifier")
  )
  .card("important notes", c =>
    c.spec("This is a binary evaluation - only scores of 3 or -3 are valid")
     .spec("Invoice numbers may contain letters, numbers, dashes, and other punctuation")
     .spec("JSON formatting errors are not penalized as long as the invoice number can be identified")
  );