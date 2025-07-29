import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsInput } from "../BfDsInput.tsx";

Deno.test("BfDsInput renders in standalone mode", () => {
  const { doc } = render(
    <BfDsInput
      label="Test Input"
      placeholder="Enter text"
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-input-container");
  const label = doc?.querySelector(".bfds-input-label");
  const input = doc?.querySelector("input");

  assertExists(container, "Input container should exist");
  assertExists(label, "Label should exist");
  assertExists(input, "Input element should exist");
  assertEquals(
    label?.textContent?.trim(),
    "Test Input",
    "Label should display correct text",
  );
  assertEquals(
    input?.getAttribute("placeholder"),
    "Enter text",
    "Input should have correct placeholder",
  );
});

Deno.test("BfDsInput renders with default state", () => {
  const { doc } = render(
    <BfDsInput
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-input-container");
  const input = doc?.querySelector("input");

  assertExists(container, "Input container should exist");
  assertExists(input, "Input element should exist");
  assertEquals(
    container?.className.includes("bfds-input-container--default"),
    true,
    "Container should have default state class",
  );
  assertEquals(
    input?.className.includes("bfds-input--default"),
    true,
    "Input should have default state class",
  );
});

Deno.test("BfDsInput renders in error state", () => {
  const { doc } = render(
    <BfDsInput
      label="Error Input"
      state="error"
      errorMessage="This field is required"
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-input-container");
  const input = doc?.querySelector("input");
  const errorDiv = doc?.querySelector(".bfds-input-error");

  assertExists(container, "Input container should exist");
  assertExists(input, "Input element should exist");
  assertExists(errorDiv, "Error message should exist");
  assertEquals(
    container?.className.includes("bfds-input-container--error"),
    true,
    "Container should have error state class",
  );
  assertEquals(
    input?.className.includes("bfds-input--error"),
    true,
    "Input should have error state class",
  );
  assertEquals(
    errorDiv?.textContent,
    "This field is required",
    "Error message should display correctly",
  );
  assertEquals(
    input?.getAttribute("aria-invalid"),
    "true",
    "Input should have aria-invalid attribute",
  );
});

Deno.test("BfDsInput renders in success state", () => {
  const { doc } = render(
    <BfDsInput
      label="Success Input"
      state="success"
      successMessage="Looks good!"
      value="valid input"
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-input-container");
  const input = doc?.querySelector("input");
  const successDiv = doc?.querySelector(".bfds-input-success");

  assertExists(container, "Input container should exist");
  assertExists(input, "Input element should exist");
  assertExists(successDiv, "Success message should exist");
  assertEquals(
    container?.className.includes("bfds-input-container--success"),
    true,
    "Container should have success state class",
  );
  assertEquals(
    input?.className.includes("bfds-input--success"),
    true,
    "Input should have success state class",
  );
  assertEquals(
    successDiv?.textContent,
    "Looks good!",
    "Success message should display correctly",
  );
});

Deno.test("BfDsInput renders in disabled state", () => {
  const { doc } = render(
    <BfDsInput
      label="Disabled Input"
      disabled
      value="disabled value"
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-input-container");
  const input = doc?.querySelector("input");

  assertExists(container, "Input container should exist");
  assertExists(input, "Input element should exist");
  assertEquals(
    container?.className.includes("bfds-input-container--disabled"),
    true,
    "Container should have disabled state class",
  );
  assertEquals(
    input?.className.includes("bfds-input--disabled"),
    true,
    "Input should have disabled state class",
  );
  assertEquals(
    input?.hasAttribute("disabled"),
    true,
    "Input should be disabled",
  );
});

Deno.test("BfDsInput renders with required attribute", () => {
  const { doc } = render(
    <BfDsInput
      label="Required Input"
      required
      value=""
      onChange={() => {}}
    />,
  );

  const label = doc?.querySelector(".bfds-input-label");
  const input = doc?.querySelector("input");
  const requiredSpan = doc?.querySelector(".bfds-input-required");

  assertExists(label, "Label should exist");
  assertExists(input, "Input element should exist");
  assertExists(requiredSpan, "Required indicator should exist");
  assertEquals(
    input?.hasAttribute("required"),
    true,
    "Input should have required attribute",
  );
  assertEquals(
    requiredSpan?.textContent,
    "*",
    "Required indicator should show asterisk",
  );
});

Deno.test("BfDsInput renders with help text", () => {
  const { doc } = render(
    <BfDsInput
      label="Input with Help"
      helpText="This is helpful information"
      value=""
      onChange={() => {}}
    />,
  );

  const helpDiv = doc?.querySelector(".bfds-input-help");
  const input = doc?.querySelector("input");

  assertExists(helpDiv, "Help text should exist");
  assertExists(input, "Input element should exist");
  assertEquals(
    helpDiv?.textContent,
    "This is helpful information",
    "Help text should display correctly",
  );

  const describedBy = input?.getAttribute("aria-describedby");
  assertEquals(
    describedBy?.includes(helpDiv?.id || ""),
    true,
    "Input should be described by help text",
  );
});

Deno.test("BfDsInput renders without label", () => {
  const { doc } = render(
    <BfDsInput
      placeholder="No label input"
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-input-container");
  const input = doc?.querySelector("input");
  const label = doc?.querySelector(".bfds-input-label");

  assertExists(container, "Input container should exist");
  assertExists(input, "Input element should exist");
  assertEquals(label, null, "Label should not exist when not provided");
});

Deno.test("BfDsInput renders with different input types", () => {
  const { doc } = render(
    <BfDsInput
      label="Email Input"
      type="email"
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  assertExists(input, "Input element should exist");
  assertEquals(
    input?.getAttribute("type"),
    "email",
    "Input should have correct type attribute",
  );
});

Deno.test("BfDsInput renders with custom className", () => {
  const { doc } = render(
    <BfDsInput
      className="custom-input-class"
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  assertExists(input, "Input element should exist");
  assertEquals(
    input?.className.includes("custom-input-class"),
    true,
    "Input should include custom class",
  );
  assertEquals(
    input?.className.includes("bfds-input"),
    true,
    "Input should include base class",
  );
});

Deno.test("BfDsInput renders with custom id", () => {
  const { doc } = render(
    <BfDsInput
      id="custom-input-id"
      label="Custom ID Input"
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  const label = doc?.querySelector("label");

  assertExists(input, "Input element should exist");
  assertExists(label, "Label should exist");
  assertEquals(
    input?.getAttribute("id"),
    "custom-input-id",
    "Input should have custom ID",
  );
  assertEquals(
    label?.getAttribute("for"),
    "custom-input-id",
    "Label should reference input ID",
  );
});

Deno.test("BfDsInput accessibility attributes", () => {
  const { doc } = render(
    <BfDsInput
      label="Accessible Input"
      helpText="Help text"
      errorMessage="Error message"
      state="error"
      value=""
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input");
  const helpDiv = doc?.querySelector(".bfds-input-help");
  const errorDiv = doc?.querySelector(".bfds-input-error");

  assertExists(input, "Input element should exist");
  assertExists(helpDiv, "Help text should exist");
  assertExists(errorDiv, "Error message should exist");

  const describedBy = input?.getAttribute("aria-describedby");
  assertEquals(
    describedBy?.includes(helpDiv?.id || ""),
    true,
    "Input should be described by help text",
  );
  assertEquals(
    describedBy?.includes(errorDiv?.id || ""),
    true,
    "Input should be described by error message",
  );
  assertEquals(
    input?.getAttribute("aria-invalid"),
    "true",
    "Input should have aria-invalid when in error state",
  );
});
