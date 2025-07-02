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
  const select = doc?.querySelector("select");
  const options = doc?.querySelectorAll("option");
  const icon = doc?.querySelector(".bfds-select-icon");

  assertExists(container, "Select container should exist");
  assertExists(wrapper, "Select wrapper should exist");
  assertExists(select, "Select element should exist");
  assertExists(icon, "Select icon should exist");
  assertEquals(options?.length, 4, "Should have 4 options (3 + placeholder)"); // 3 options + placeholder
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
  const select = doc?.querySelector("select");

  assertExists(label, "Label should exist");
  assertExists(select, "Select should exist");
  assertEquals(
    label?.textContent?.trim(),
    "Country",
    "Label should display correct text",
  );
  assertEquals(
    label?.getAttribute("for"),
    select?.id,
    "Label should reference select ID",
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

  const placeholderOption = doc?.querySelector(
    "option[value='']",
  ) as HTMLOptionElement;
  assertExists(placeholderOption, "Placeholder option should exist");
  assertEquals(
    placeholderOption?.textContent,
    "Choose a country",
    "Placeholder should have custom text",
  );
  assertEquals(
    placeholderOption?.hasAttribute("disabled"),
    true,
    "Placeholder option should be disabled",
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

  const select = doc?.querySelector("select") as HTMLSelectElement;
  assertExists(select, "Select element should exist");
  const selectedOption = doc?.querySelector("option[selected]");
  assertEquals(
    selectedOption?.getAttribute("value"),
    "ca",
    "Selected option should have correct value",
  );
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
  const select = doc?.querySelector("select") as HTMLSelectElement;

  assertExists(container, "Container should exist");
  assertExists(select, "Select should exist");
  assertEquals(
    container?.className.includes("bfds-select-container--disabled"),
    true,
    "Container should have disabled class",
  );
  assertEquals(
    select?.className.includes("bfds-select--disabled"),
    true,
    "Select should have disabled class",
  );
  assertEquals(
    select?.hasAttribute("disabled"),
    true,
    "Select should be disabled",
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
  const select = doc?.querySelector("select") as HTMLSelectElement;

  assertExists(label, "Label should exist");
  assertExists(requiredSpan, "Required indicator should exist");
  assertExists(select, "Select should exist");
  assertEquals(
    requiredSpan?.textContent,
    "*",
    "Required indicator should show asterisk",
  );
  assertEquals(
    select?.hasAttribute("required"),
    true,
    "Select should have required attribute",
  );
});

Deno.test("BfDsSelect renders options with correct attributes", () => {
  const { doc } = render(
    <BfDsSelect
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const usOption = doc?.querySelector("option[value='us']");
  const caOption = doc?.querySelector("option[value='ca']");
  const ukOption = doc?.querySelector("option[value='uk']");

  assertExists(usOption, "US option should exist");
  assertExists(caOption, "Canada option should exist");
  assertExists(ukOption, "UK option should exist");
  assertEquals(
    usOption?.textContent,
    "United States",
    "US option should have correct text",
  );
  assertEquals(
    caOption?.textContent,
    "Canada",
    "Canada option should have correct text",
  );
  assertEquals(
    ukOption?.textContent,
    "United Kingdom",
    "UK option should have correct text",
  );
});

Deno.test("BfDsSelect renders with disabled options", () => {
  const { doc } = render(
    <BfDsSelect
      options={optionsWithDisabled}
      value=""
      onChange={() => {}}
    />,
  );

  const option1 = doc?.querySelector(
    "option[value='option1']",
  ) as HTMLOptionElement;
  const option2 = doc?.querySelector(
    "option[value='option2']",
  ) as HTMLOptionElement;
  const option3 = doc?.querySelector(
    "option[value='option3']",
  ) as HTMLOptionElement;

  assertExists(option1, "Option 1 should exist");
  assertExists(option2, "Option 2 should exist");
  assertExists(option3, "Option 3 should exist");
  assertEquals(
    option1?.hasAttribute("disabled"),
    false,
    "Option 1 should not be disabled",
  );
  assertEquals(
    option2?.hasAttribute("disabled"),
    true,
    "Option 2 should be disabled",
  );
  assertEquals(
    option3?.hasAttribute("disabled"),
    false,
    "Option 3 should not be disabled",
  );
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

  const select = doc?.querySelector("select");
  assertExists(select, "Select element should exist");
  assertEquals(
    select?.className.includes("custom-select-class"),
    true,
    "Select should include custom class",
  );
  assertEquals(
    select?.className.includes("bfds-select"),
    true,
    "Select should include base class",
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

  const select = doc?.querySelector("select");
  const label = doc?.querySelector("label");

  assertExists(select, "Select element should exist");
  assertExists(label, "Label should exist");
  assertEquals(select?.id, "custom-select-id", "Select should have custom ID");
  assertEquals(
    label?.getAttribute("for"),
    "custom-select-id",
    "Label should reference select ID",
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

  const select = doc?.querySelector("select");
  assertExists(select, "Select element should exist");
  assertEquals(
    select?.getAttribute("name"),
    "country-select",
    "Select should have correct name attribute",
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

  const placeholderOption = doc?.querySelector(
    "option[value='']",
  ) as HTMLOptionElement;
  assertExists(placeholderOption, "Default placeholder option should exist");
  assertEquals(
    placeholderOption?.textContent,
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

  const placeholderOption = doc?.querySelector("option[value='']");
  assertEquals(
    placeholderOption,
    null,
    "Placeholder option should not exist when placeholder is empty",
  );
});
