import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsToggle } from "../BfDsToggle.tsx";

Deno.test("BfDsToggle renders in standalone mode", () => {
  const { doc } = render(
    <BfDsToggle
      label="Enable feature"
      checked={false}
      onChange={() => {}}
    />,
  );

  const wrapper = doc?.querySelector(".bfds-toggle-wrapper");
  const input = doc?.querySelector("input[type='checkbox']");
  const toggle = doc?.querySelector(".bfds-toggle");
  const track = doc?.querySelector(".bfds-toggle-track");
  const thumb = doc?.querySelector(".bfds-toggle-thumb");
  const labelSpan = doc?.querySelector(".bfds-toggle-label");

  assertExists(wrapper, "Toggle wrapper should exist");
  assertExists(input, "Toggle input should exist");
  assertExists(toggle, "Toggle visual element should exist");
  assertExists(track, "Toggle track should exist");
  assertExists(thumb, "Toggle thumb should exist");
  assertExists(labelSpan, "Label should exist");
  assertEquals(
    labelSpan?.textContent?.trim(),
    "Enable feature",
    "Label should display correct text",
  );
});

Deno.test("BfDsToggle renders in checked state", () => {
  const { doc } = render(
    <BfDsToggle
      label="Checked toggle"
      checked
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector(
    "input[type='checkbox']",
  ) as HTMLInputElement;
  const toggle = doc?.querySelector(".bfds-toggle");

  assertExists(input, "Toggle input should exist");
  assertExists(toggle, "Toggle visual element should exist");
  assertEquals(input?.hasAttribute("checked"), true, "Input should be checked");
  assertEquals(
    toggle?.className?.includes("bfds-toggle--checked"),
    true,
    "Toggle should have checked class",
  );
});

Deno.test("BfDsToggle renders in unchecked state", () => {
  const { doc } = render(
    <BfDsToggle
      label="Unchecked toggle"
      checked={false}
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector(
    "input[type='checkbox']",
  ) as HTMLInputElement;
  const toggle = doc?.querySelector(".bfds-toggle");

  assertExists(input, "Toggle input should exist");
  assertExists(toggle, "Toggle visual element should exist");
  assertEquals(
    input?.hasAttribute("checked"),
    false,
    "Input should not be checked",
  );
  assertEquals(
    toggle?.className?.includes("bfds-toggle--checked"),
    false,
    "Toggle should not have checked class",
  );
});

Deno.test("BfDsToggle renders in disabled state", () => {
  const { doc } = render(
    <BfDsToggle
      label="Disabled toggle"
      disabled
      checked={false}
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector(
    "input[type='checkbox']",
  ) as HTMLInputElement;
  const toggle = doc?.querySelector(".bfds-toggle");

  assertExists(input, "Toggle input should exist");
  assertExists(toggle, "Toggle visual element should exist");
  assertEquals(
    input?.hasAttribute("disabled"),
    true,
    "Input should be disabled",
  );
  assertEquals(
    toggle?.className?.includes("bfds-toggle--disabled"),
    true,
    "Toggle should have disabled class",
  );
});

Deno.test("BfDsToggle renders with required attribute", () => {
  const { doc } = render(
    <BfDsToggle
      label="Required toggle"
      required
      checked={false}
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector(
    "input[type='checkbox']",
  ) as HTMLInputElement;
  const labelSpan = doc?.querySelector(".bfds-toggle-label");
  const requiredSpan = doc?.querySelector(".bfds-toggle-required");

  assertExists(input, "Toggle input should exist");
  assertExists(labelSpan, "Label should exist");
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

Deno.test("BfDsToggle renders with different sizes", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(
      <BfDsToggle
        label={`${size} toggle`}
        size={size}
        checked={false}
        onChange={() => {}}
      />,
    );

    const toggle = doc?.querySelector(".bfds-toggle");
    assertExists(toggle, `Toggle with ${size} size should exist`);
    assertEquals(
      toggle?.className.includes(`bfds-toggle--${size}`),
      true,
      `Toggle should have ${size} class`,
    );
  });
});

Deno.test("BfDsToggle renders without label", () => {
  const { doc } = render(
    <BfDsToggle
      checked={false}
      onChange={() => {}}
    />,
  );

  const wrapper = doc?.querySelector(".bfds-toggle-wrapper");
  const input = doc?.querySelector("input[type='checkbox']");
  const toggle = doc?.querySelector(".bfds-toggle");
  const labelSpan = doc?.querySelector(".bfds-toggle-label");

  assertExists(wrapper, "Toggle wrapper should exist");
  assertExists(input, "Toggle input should exist");
  assertExists(toggle, "Toggle visual element should exist");
  assertEquals(labelSpan, null, "Label should not exist when not provided");
});

Deno.test("BfDsToggle renders with custom className", () => {
  const { doc } = render(
    <BfDsToggle
      label="Custom class toggle"
      className="custom-toggle-class"
      checked={false}
      onChange={() => {}}
    />,
  );

  const toggle = doc?.querySelector(".bfds-toggle");
  assertExists(toggle, "Toggle should exist");
  assertEquals(
    toggle?.className.includes("custom-toggle-class"),
    true,
    "Toggle should include custom class",
  );
  assertEquals(
    toggle?.className.includes("bfds-toggle"),
    true,
    "Toggle should include base class",
  );
});

Deno.test("BfDsToggle renders with custom id", () => {
  const { doc } = render(
    <BfDsToggle
      label="Custom ID toggle"
      id="custom-toggle-id"
      checked={false}
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input[type='checkbox']");
  assertExists(input, "Toggle input should exist");
  assertEquals(input?.id, "custom-toggle-id", "Input should have custom ID");
});

Deno.test("BfDsToggle renders with name attribute", () => {
  const { doc } = render(
    <BfDsToggle
      label="Named toggle"
      name="toggle-name"
      checked={false}
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector("input[type='checkbox']");
  assertExists(input, "Toggle input should exist");
  assertEquals(
    input?.getAttribute("name"),
    "toggle-name",
    "Input should have correct name attribute",
  );
});

Deno.test("BfDsToggle accessibility attributes", () => {
  const { doc } = render(
    <BfDsToggle
      label="Accessible toggle"
      checked
      onChange={() => {}}
    />,
  );

  const toggle = doc?.querySelector(".bfds-toggle");
  assertExists(toggle, "Toggle visual element should exist");
  assertEquals(
    toggle?.getAttribute("role"),
    "switch",
    "Toggle should have switch role",
  );
  assertEquals(
    toggle?.getAttribute("aria-checked"),
    "true",
    "Toggle should have correct aria-checked value",
  );
  assertEquals(
    toggle?.getAttribute("tabIndex"),
    "0",
    "Toggle should be focusable",
  );
});

Deno.test("BfDsToggle accessibility when disabled", () => {
  const { doc } = render(
    <BfDsToggle
      label="Disabled accessible toggle"
      disabled
      checked={false}
      onChange={() => {}}
    />,
  );

  const toggle = doc?.querySelector(".bfds-toggle");
  assertExists(toggle, "Toggle visual element should exist");
  assertEquals(
    toggle?.getAttribute("tabIndex"),
    "-1",
    "Toggle should not be focusable when disabled",
  );
});

Deno.test("BfDsToggle default size is medium", () => {
  const { doc } = render(
    <BfDsToggle
      label="Default toggle"
      checked={false}
      onChange={() => {}}
    />,
  );

  const toggle = doc?.querySelector(".bfds-toggle");
  assertExists(toggle, "Toggle should exist");
  assertEquals(
    toggle?.className.includes("bfds-toggle--medium"),
    true,
    "Toggle should have medium size by default",
  );
});

Deno.test("BfDsToggle checked and disabled state combination", () => {
  const { doc } = render(
    <BfDsToggle
      label="Checked disabled toggle"
      checked
      disabled
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector(
    "input[type='checkbox']",
  ) as HTMLInputElement;
  const toggle = doc?.querySelector(".bfds-toggle");

  assertExists(input, "Toggle input should exist");
  assertExists(toggle, "Toggle visual element should exist");
  assertEquals(input?.hasAttribute("checked"), true, "Input should be checked");
  assertEquals(
    input?.hasAttribute("disabled"),
    true,
    "Input should be disabled",
  );
  assertEquals(
    toggle?.className.includes("bfds-toggle--checked"),
    true,
    "Toggle should have checked class",
  );
  assertEquals(
    toggle?.className.includes("bfds-toggle--disabled"),
    true,
    "Toggle should have disabled class",
  );
});

Deno.test("BfDsToggle track and thumb structure", () => {
  const { doc } = render(
    <BfDsToggle
      label="Structure test"
      checked={false}
      onChange={() => {}}
    />,
  );

  const toggle = doc?.querySelector(".bfds-toggle");
  const track = doc?.querySelector(".bfds-toggle-track");
  const thumb = doc?.querySelector(".bfds-toggle-thumb");

  assertExists(toggle, "Toggle should exist");
  assertExists(track, "Toggle track should exist");
  assertExists(thumb, "Toggle thumb should exist");

  // Verify structure: toggle > track > thumb
  assertEquals(toggle?.contains(track!), true, "Toggle should contain track");
  assertEquals(track?.contains(thumb!), true, "Track should contain thumb");
});
