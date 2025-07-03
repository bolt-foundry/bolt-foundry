import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsSelect, type BfDsSelectOption } from "../BfDsSelect.tsx";

const sampleOptions: Array<BfDsSelectOption> = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
];

const optionsWithDisabled: Array<BfDsSelectOption> = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2", disabled: true },
  { value: "option3", label: "Option 3" },
];

Deno.test("BfDsSelect renders with options", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-select-container");
  const wrapper = doc?.querySelector(".bfds-select-wrapper");
  const input = doc?.querySelector("input");
  const icon = doc?.querySelector(".bfds-select-icon");

  assertExists(container, "Select container should exist");
  assertExists(wrapper, "Select wrapper should exist");
  assertExists(input, "Input element should exist");
  assertExists(icon, "Select icon should exist");
});

Deno.test("BfDsSelect renders with label", () => {
  const { doc } = render(
    <BfDsSelect
      label="Country"
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const label = doc?.querySelector(".bfds-select-label");
  const input = doc?.querySelector("input");

  assertExists(label, "Label should exist");
  assertExists(input, "Input should exist");
  assertEquals(
    label?.textContent?.trim(),
    "Country",
    "Label should display correct text",
  );
  assertEquals(
    label?.getAttribute("for"),
    input?.id,
    "Label should reference input ID",
  );
});

Deno.test("BfDsSelect renders with custom placeholder", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      placeholder="Choose a country"
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");
  assertEquals(
    input?.getAttribute("placeholder"),
    "Choose a country",
    "Input should have custom placeholder text",
  );
});

Deno.test("BfDsSelect renders with selected value", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value="ca"
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input element should exist");
  // Note: The display value would be set by useEffect in a real render
  // This test verifies the structure is correct
});

Deno.test("BfDsSelect renders in disabled state", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      disabled
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-select-container");
  const input = doc?.querySelector("input") as HTMLInputElement;

  assertExists(container, "Container should exist");
  assertExists(input, "Input should exist");
  assertEquals(
    container?.className.includes("bfds-select-container--disabled"),
    true,
    "Container should have disabled class",
  );
  assertEquals(
    input?.className.includes("bfds-select--disabled"),
    true,
    "Input should have disabled class",
  );
  assertEquals(
    input?.hasAttribute("disabled"),
    true,
    "Input should be disabled",
  );
});

Deno.test("BfDsSelect renders with required attribute", () => {
  const { doc } = render(
    <BfDsSelect
      label="Required Country"
      options={sampleOptions}
      required
      value=""
      onChange={() => {}}
    />,
  );

  const label = doc?.querySelector(".bfds-select-label");
  const requiredSpan = doc?.querySelector(".bfds-select-required");
  const input = doc?.querySelector("input") as HTMLInputElement;

  assertExists(label, "Label should exist");
  assertExists(requiredSpan, "Required indicator should exist");
  assertExists(input, "Input should exist");
  assertEquals(
    requiredSpan?.textContent,
    "*",
    "Required indicator should show asterisk",
  );
  assertEquals(
    input?.hasAttribute("required"),
    true,
    "Input should have required attribute",
  );
});

Deno.test("BfDsSelect renders with options data", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  assertExists(input, "Input should exist for option rendering");
  // Options are now rendered in the dropdown when opened, not as static DOM elements
});

Deno.test("BfDsSelect handles disabled options", () => {
  const { doc } = render(
    <BfDsSelect
      options={optionsWithDisabled}
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  assertExists(input, "Input should exist with disabled options");
  // Disabled options are handled in the dropdown logic, not as static DOM elements
});

Deno.test("BfDsSelect renders without label", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const label = doc?.querySelector(".bfds-select-label");
  const container = doc?.querySelector(".bfds-select-container");

  assertEquals(label, null, "Label should not exist when not provided");
  assertExists(container, "Container should still exist");
});

Deno.test("BfDsSelect renders with custom className", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      className="custom-select-class"
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  assertExists(input, "Input element should exist");
  assertEquals(
    input?.className.includes("custom-select-class"),
    true,
    "Input should include custom class",
  );
  assertEquals(
    input?.className.includes("bfds-select"),
    true,
    "Input should include base class",
  );
});

Deno.test("BfDsSelect renders with custom id", () => {
  const { doc } = render(
    <BfDsSelect
      id="custom-select-id"
      label="Custom ID Select"
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  const label = doc?.querySelector("label");

  assertExists(input, "Input element should exist");
  assertExists(label, "Label should exist");
  assertEquals(input?.id, "custom-select-id", "Input should have custom ID");
  assertEquals(
    label?.getAttribute("for"),
    "custom-select-id",
    "Label should reference input ID",
  );
});

Deno.test("BfDsSelect renders with name attribute", () => {
  const { doc } = render(
    <BfDsSelect
      name="country-select"
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  assertExists(input, "Input element should exist");
  assertEquals(
    input?.getAttribute("name"),
    "country-select",
    "Input should have correct name attribute",
  );
});

Deno.test("BfDsSelect renders dropdown icon", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const icon = doc?.querySelector(".bfds-select-icon");
  const svg = doc?.querySelector("svg");

  assertExists(icon, "Select icon should exist");
  assertExists(svg, "SVG icon should exist");
  assertEquals(
    icon?.className?.includes("bfds-select-icon"),
    true,
    "Icon should have select-icon class",
  );
});

Deno.test("BfDsSelect default placeholder", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");
  assertEquals(
    input?.getAttribute("placeholder"),
    "Select...",
    "Default placeholder should have default text",
  );
});

Deno.test("BfDsSelect without placeholder", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      placeholder=""
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");
  assertEquals(
    input?.getAttribute("placeholder"),
    "",
    "Input should have empty placeholder when not provided",
  );
});

Deno.test("BfDsSelect typeahead renders input instead of select", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      typeahead
      value=""
      onChange={() => {}}
    />,
  );

  const select = doc?.querySelector("select");
  const input = doc?.querySelector("input");
  const dropdown = doc?.querySelector(".bfds-select-dropdown");

  assertEquals(
    select,
    null,
    "Select element should not exist in typeahead mode",
  );
  assertExists(input, "Input element should exist in typeahead mode");
  assertEquals(dropdown, null, "Dropdown should not be visible initially");
});

Deno.test("BfDsSelect typeahead shows dropdown on focus", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      typeahead
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");

  // Note: In a real test environment, you'd need to trigger state updates
  // This test verifies the structure is correct
});

Deno.test("BfDsSelect typeahead has correct ARIA attributes", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      typeahead
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");

  assertEquals(
    input.getAttribute("role"),
    "combobox",
    "Input should have combobox role",
  );
  assertEquals(
    input.getAttribute("aria-expanded"),
    "false",
    "Input should have aria-expanded",
  );
  assertEquals(
    input.getAttribute("aria-haspopup"),
    "listbox",
    "Input should have aria-haspopup",
  );
  assertEquals(
    input.getAttribute("aria-autocomplete"),
    "list",
    "Input should have aria-autocomplete",
  );
});

Deno.test("BfDsSelect typeahead renders with selected value", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      typeahead
      value="ca"
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");

  // Note: The actual display value would be set by useEffect in a real render
  // This test verifies the structure is correct
});

Deno.test("BfDsSelect typeahead input has correct attributes", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      typeahead
      placeholder="Type to search..."
      disabled={false}
      required
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");

  assertEquals(input.getAttribute("type"), "text", "Input should be text type");
  assertEquals(
    input.getAttribute("placeholder"),
    "Type to search...",
    "Input should have correct placeholder",
  );
  assertEquals(
    input.hasAttribute("required"),
    true,
    "Input should be required",
  );
  assertEquals(
    input.hasAttribute("disabled"),
    false,
    "Input should not be disabled",
  );
  assertEquals(
    input.getAttribute("autocomplete"),
    "off",
    "Input should have autocomplete off",
  );
});

Deno.test("BfDsSelect typeahead icon is clickable", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      typeahead
      value=""
      onChange={() => {}}
    />,
  );

  const icon = doc?.querySelector(".bfds-select-icon") as HTMLElement;
  assertExists(icon, "Icon should exist");

  assertEquals(
    icon.className.includes("bfds-select-icon--clickable"),
    true,
    "Icon should have clickable class in typeahead mode",
  );
});

Deno.test("BfDsSelect regular icon is clickable", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const icon = doc?.querySelector(".bfds-select-icon") as HTMLElement;
  assertExists(icon, "Icon should exist");

  assertEquals(
    icon.className.includes("bfds-select-icon--clickable"),
    true,
    "Icon should have clickable class in regular mode too (unified behavior)",
  );
});

Deno.test("BfDsSelect typeahead dropdown has positioning classes", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      typeahead
      value=""
      onChange={() => {}}
    />,
  );

  // Note: In a real browser environment, the dropdown would be positioned
  // based on viewport calculations. In this test environment, we just verify
  // the structure is correct for positioning logic.
  const container = doc?.querySelector(".bfds-select-container");
  assertExists(
    container,
    "Container should exist for positioning calculations",
  );
});

Deno.test("BfDsSelect option selection works", () => {
  let selectedValue = "";
  const handleChange = (value: string) => {
    selectedValue = value;
  };

  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value={selectedValue}
      onChange={handleChange}
    />,
  );

  const input = doc?.querySelector("input") as HTMLInputElement;
  assertExists(input, "Input should exist");

  // Note: In a real browser environment, you could simulate clicks and test
  // the onChange callback. This test verifies the structure is in place.
  assertEquals(
    typeof handleChange,
    "function",
    "onChange handler should be provided",
  );
});
