import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { CfDsCheckbox } from "../CfDsCheckbox.tsx";

Deno.test("CfDsCheckbox renders with label", () => {
  const labelText = "Accept terms";
  const { getByText } = render(
    <CfDsCheckbox label={labelText} onChange={() => {}} />,
  );

  const label = getByText(labelText);
  assertExists(label, `Label with text "${labelText}" should exist`);
});

Deno.test("CfDsCheckbox renders as checked when value is true", () => {
  const { doc } = render(
    <CfDsCheckbox value onChange={() => {}} />,
  );

  // The component uses icon to show checked state
  const icon = doc?.querySelector(".icon") || doc?.querySelector("svg");
  assertExists(icon, "Icon element should exist");

  // Check for an input with checked attribute
  const input = doc?.querySelector("input[type='checkbox']");
  assertExists(input, "Checkbox input element should exist");
  assertEquals(
    input?.hasAttribute("checked") || input?.getAttribute("checked") === "",
    true,
    "Input should be checked",
  );
});

Deno.test("CfDsCheckbox renders as unchecked when value is false", () => {
  const { doc } = render(
    <CfDsCheckbox value={false} onChange={() => {}} />,
  );

  // Check that the input is not checked
  const input = doc?.querySelector("input[type='checkbox']");
  assertExists(input, "Checkbox input element should exist");
  assertEquals(
    input?.hasAttribute("checked") || input?.getAttribute("checked") === "",
    false,
    "Input should not be checked",
  );
});

Deno.test("CfDsCheckbox renders as disabled when disabled prop is true", () => {
  const { doc } = render(
    <CfDsCheckbox disabled onChange={() => {}} />,
  );

  const input = doc?.querySelector("input[type='checkbox']");
  assertExists(input, "Checkbox input element should exist");
  assertEquals(
    input?.hasAttribute("disabled"),
    true,
    "Input should have disabled attribute",
  );
});

Deno.test("CfDsCheckbox renders with different sizes", () => {
  const { doc } = render(
    <CfDsCheckbox
      label="Size Test"
      value
      onChange={() => {}}
      size="large"
    />,
  );

  // Look for the checkbox input
  const checkbox = doc?.querySelector("input[type='checkbox']");
  assertExists(checkbox, "Checkbox input should exist");

  // The main checkbox container
  const checkboxContainer = doc?.querySelector("div[data-bf-testid]") ||
    doc?.querySelector("input[type='checkbox']")?.parentElement;
  assertExists(checkboxContainer, "Checkbox container should exist");

  // Look for the icon - CfDsIcon is rendered with the appropriate size
  const icon = doc?.querySelector("svg");
  assertExists(icon, "Icon element should exist");

  // Verify the checkbox label contains the text
  const labelElement = doc?.querySelector("label");
  assertExists(labelElement, "Label element should exist");

  const labelText = labelElement?.textContent;
  assertEquals(
    labelText?.includes("Size Test"),
    true,
    "Label should contain 'Size Test'",
  );
});

Deno.test("CfDsCheckbox renders with meta information", () => {
  const metaText = "Additional information";
  const { getByText } = render(
    <CfDsCheckbox meta={metaText} onChange={() => {}} />,
  );

  const meta = getByText(metaText);
  assertExists(meta, `Meta text "${metaText}" should exist`);
});

Deno.test("CfDsCheckbox renders with test ID when provided", () => {
  const testId = "test-checkbox";
  const { doc } = render(
    <CfDsCheckbox testId={testId} value={false} onChange={() => {}} />,
  );

  const checkbox = doc?.querySelector(`[data-bf-testid="${testId}-true"]`);
  assertExists(checkbox, "Checkbox with test ID should exist");
});
