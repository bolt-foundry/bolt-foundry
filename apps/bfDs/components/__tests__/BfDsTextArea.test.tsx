import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsTextArea } from "../BfDsTextArea.tsx";

Deno.test("BfDsTextArea renders in standalone mode", () => {
  const { doc } = render(
    <BfDsTextArea
      label="Message"
      placeholder="Enter your message"
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-textarea-container");
  const label = doc?.querySelector(".bfds-textarea-label");
  const textarea = doc?.querySelector("textarea");

  assertExists(container, "Textarea container should exist");
  assertExists(label, "Label should exist");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(
    label?.textContent?.trim(),
    "Message",
    "Label should display correct text",
  );
  assertEquals(
    textarea?.getAttribute("placeholder"),
    "Enter your message",
    "Textarea should have correct placeholder",
  );
});

Deno.test("BfDsTextArea renders with default state", () => {
  const { doc } = render(
    <BfDsTextArea
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-textarea-container");
  const textarea = doc?.querySelector("textarea");

  assertExists(container, "Textarea container should exist");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(
    container?.className.includes("bfds-textarea-container--default"),
    true,
    "Container should have default state class",
  );
  assertEquals(
    textarea?.className.includes("bfds-textarea--default"),
    true,
    "Textarea should have default state class",
  );
  assertEquals(
    textarea?.className.includes("bfds-textarea--resize-vertical"),
    true,
    "Textarea should have default resize class",
  );
});

Deno.test("BfDsTextArea renders in error state", () => {
  const { doc } = render(
    <BfDsTextArea
      label="Error Textarea"
      state="error"
      errorMessage="This field is required"
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-textarea-container");
  const textarea = doc?.querySelector("textarea");
  const errorDiv = doc?.querySelector(".bfds-textarea-error");

  assertExists(container, "Textarea container should exist");
  assertExists(textarea, "Textarea element should exist");
  assertExists(errorDiv, "Error message should exist");
  assertEquals(
    container?.className.includes("bfds-textarea-container--error"),
    true,
    "Container should have error state class",
  );
  assertEquals(
    textarea?.className.includes("bfds-textarea--error"),
    true,
    "Textarea should have error state class",
  );
  assertEquals(
    errorDiv?.textContent,
    "This field is required",
    "Error message should display correctly",
  );
  assertEquals(
    textarea?.getAttribute("aria-invalid"),
    "true",
    "Textarea should have aria-invalid attribute",
  );
});

Deno.test("BfDsTextArea renders in success state", () => {
  const { doc } = render(
    <BfDsTextArea
      label="Success Textarea"
      state="success"
      successMessage="Looks good!"
      value="valid content"
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-textarea-container");
  const textarea = doc?.querySelector("textarea");
  const successDiv = doc?.querySelector(".bfds-textarea-success");

  assertExists(container, "Textarea container should exist");
  assertExists(textarea, "Textarea element should exist");
  assertExists(successDiv, "Success message should exist");
  assertEquals(
    container?.className.includes("bfds-textarea-container--success"),
    true,
    "Container should have success state class",
  );
  assertEquals(
    textarea?.className.includes("bfds-textarea--success"),
    true,
    "Textarea should have success state class",
  );
  assertEquals(
    successDiv?.textContent,
    "Looks good!",
    "Success message should display correctly",
  );
});

Deno.test("BfDsTextArea renders in disabled state", () => {
  const { doc } = render(
    <BfDsTextArea
      label="Disabled Textarea"
      disabled
      value="disabled content"
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-textarea-container");
  const textarea = doc?.querySelector("textarea");

  assertExists(container, "Textarea container should exist");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(
    container?.className.includes("bfds-textarea-container--disabled"),
    true,
    "Container should have disabled state class",
  );
  assertEquals(
    textarea?.className.includes("bfds-textarea--disabled"),
    true,
    "Textarea should have disabled state class",
  );
  assertEquals(
    textarea?.hasAttribute("disabled"),
    true,
    "Textarea should be disabled",
  );
});

Deno.test("BfDsTextArea renders with required attribute", () => {
  const { doc } = render(
    <BfDsTextArea
      label="Required Textarea"
      required
      value=""
      onChange={() => {}}
    />,
  );

  const label = doc?.querySelector(".bfds-textarea-label");
  const textarea = doc?.querySelector("textarea");
  const requiredSpan = doc?.querySelector(".bfds-textarea-required");

  assertExists(label, "Label should exist");
  assertExists(textarea, "Textarea element should exist");
  assertExists(requiredSpan, "Required indicator should exist");
  assertEquals(
    textarea?.hasAttribute("required"),
    true,
    "Textarea should have required attribute",
  );
  assertEquals(
    requiredSpan?.textContent,
    "*",
    "Required indicator should show asterisk",
  );
});

Deno.test("BfDsTextArea renders with help text", () => {
  const { doc } = render(
    <BfDsTextArea
      label="Textarea with Help"
      helpText="This is helpful information"
      value=""
      onChange={() => {}}
    />,
  );

  const helpDiv = doc?.querySelector(".bfds-textarea-help");
  const textarea = doc?.querySelector("textarea");

  assertExists(helpDiv, "Help text should exist");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(
    helpDiv?.textContent,
    "This is helpful information",
    "Help text should display correctly",
  );

  const describedBy = textarea?.getAttribute("aria-describedby");
  assertEquals(
    describedBy?.includes(helpDiv?.id || ""),
    true,
    "Textarea should be described by help text",
  );
});

Deno.test("BfDsTextArea renders with different resize options", () => {
  const resizeOptions = ["none", "both", "horizontal", "vertical"] as const;

  resizeOptions.forEach((resize) => {
    const { doc } = render(
      <BfDsTextArea
        resize={resize}
        value=""
        onChange={() => {}}
      />,
    );

    const textarea = doc?.querySelector("textarea");
    assertExists(textarea, `Textarea with ${resize} resize should exist`);
    assertEquals(
      textarea?.className.includes(`bfds-textarea--resize-${resize}`),
      true,
      `Textarea should have ${resize} resize class`,
    );
  });
});

Deno.test("BfDsTextArea renders without label", () => {
  const { doc } = render(
    <BfDsTextArea
      placeholder="No label textarea"
      value=""
      onChange={() => {}}
    />,
  );

  const container = doc?.querySelector(".bfds-textarea-container");
  const textarea = doc?.querySelector("textarea");
  const label = doc?.querySelector(".bfds-textarea-label");

  assertExists(container, "Textarea container should exist");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(label, null, "Label should not exist when not provided");
});

Deno.test("BfDsTextArea renders with custom className", () => {
  const { doc } = render(
    <BfDsTextArea
      className="custom-textarea-class"
      value=""
      onChange={() => {}}
    />,
  );

  const textarea = doc?.querySelector("textarea");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(
    textarea?.className.includes("custom-textarea-class"),
    true,
    "Textarea should include custom class",
  );
  assertEquals(
    textarea?.className.includes("bfds-textarea"),
    true,
    "Textarea should include base class",
  );
});

Deno.test("BfDsTextArea renders with custom id", () => {
  const { doc } = render(
    <BfDsTextArea
      id="custom-textarea-id"
      label="Custom ID Textarea"
      value=""
      onChange={() => {}}
    />,
  );

  const textarea = doc?.querySelector("textarea");
  const label = doc?.querySelector("label");

  assertExists(textarea, "Textarea element should exist");
  assertExists(label, "Label should exist");
  assertEquals(
    textarea?.id,
    "custom-textarea-id",
    "Textarea should have custom ID",
  );
  assertEquals(
    label?.getAttribute("for"),
    "custom-textarea-id",
    "Label should reference textarea ID",
  );
});

Deno.test("BfDsTextArea renders with HTML attributes", () => {
  const { doc } = render(
    <BfDsTextArea
      rows={5}
      cols={50}
      name="message"
      value=""
      onChange={() => {}}
    />,
  );

  const textarea = doc?.querySelector("textarea");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(
    textarea?.getAttribute("rows"),
    "5",
    "Textarea should have rows attribute",
  );
  assertEquals(
    textarea?.getAttribute("cols"),
    "50",
    "Textarea should have cols attribute",
  );
  assertEquals(
    textarea?.getAttribute("name"),
    "message",
    "Textarea should have name attribute",
  );
});

Deno.test("BfDsTextArea accessibility attributes", () => {
  const { doc } = render(
    <BfDsTextArea
      label="Accessible Textarea"
      helpText="Help text"
      errorMessage="Error message"
      state="error"
      value=""
      onChange={() => {}}
    />,
  );

  const textarea = doc?.querySelector("textarea");
  const helpDiv = doc?.querySelector(".bfds-textarea-help");
  const errorDiv = doc?.querySelector(".bfds-textarea-error");

  assertExists(textarea, "Textarea element should exist");
  assertExists(helpDiv, "Help text should exist");
  assertExists(errorDiv, "Error message should exist");

  const describedBy = textarea?.getAttribute("aria-describedby");
  assertEquals(
    describedBy?.includes(helpDiv?.id || ""),
    true,
    "Textarea should be described by help text",
  );
  assertEquals(
    describedBy?.includes(errorDiv?.id || ""),
    true,
    "Textarea should be described by error message",
  );
  assertEquals(
    textarea?.getAttribute("aria-invalid"),
    "true",
    "Textarea should have aria-invalid when in error state",
  );
});

Deno.test("BfDsTextArea default resize is vertical", () => {
  const { doc } = render(
    <BfDsTextArea value="" onChange={() => {}} />,
  );

  const textarea = doc?.querySelector("textarea");
  assertExists(textarea, "Textarea element should exist");
  assertEquals(
    textarea?.className.includes("bfds-textarea--resize-vertical"),
    true,
    "Textarea should have vertical resize by default",
  );
});
