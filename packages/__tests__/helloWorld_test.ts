// hello world deno test

Deno.test("We have tests!", () => {
  const result = 1 + 1;
  const expected = 2;
  if (result !== expected) {
    throw new Error(`Expected ${expected}, but got ${result}`);
  }
});
