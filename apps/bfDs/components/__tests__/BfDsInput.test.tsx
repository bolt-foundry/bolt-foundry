import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsInput } from "../BfDsInput.tsx";

Deno.test("BfDsInput renders with label", () => {
  const labelText = "Name";
  const { getByText } = render(
    <BfDsInput label={labelText} onChange={() => {}} />,
  );

  const label = getByText(labelText);
  assertExists(label, `Label with text "${labelText}" should exist`);
});

Deno.test("BfDsInput renders with placeholder", () => {
  const placeholderText = "Enter your name";
  const { doc } = render(
    <BfDsInput placeholder={placeholderText} onChange={() => {}} />,
  );
  const input = doc?.querySelector("input");

  assertExists(input, "Input element should exist");
  assertEquals(
    input?.getAttribute("placeholder"),
    placeholderText,
    "Input should have the correct placeholder",
  );
});

Deno.test("BfDsInput renders as disabled when disabled prop is true", () => {
  const { doc } = render(<BfDsInput disabled onChange={() => {}} />);
  const input = doc?.querySelector("input");

  assertExists(input, "Input element should exist");
  assertEquals(
    input?.hasAttribute("disabled"),
    true,
    "Input should have disabled attribute",
  );
});
