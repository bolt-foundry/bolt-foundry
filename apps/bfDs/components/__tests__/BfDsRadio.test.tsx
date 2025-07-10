import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsRadio, type BfDsRadioOption } from "../BfDsRadio.tsx";

const sampleOptions: Array<BfDsRadioOption> = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const disabledOptions: Array<BfDsRadioOption> = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2", disabled: true },
  { value: "option3", label: "Option 3" },
];

Deno.test("BfDsRadio renders radio group with options", () => {
  const { doc } = render(
    <BfDsRadio
      name="size"
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const radioGroup = doc?.querySelector(".bfds-radio-group");
  const radioInputs = doc?.querySelectorAll("input[type='radio']");
  const radioLabels = doc?.querySelectorAll(".bfds-radio-label");

  assertExists(radioGroup, "Radio group should exist");
  assertEquals(radioInputs?.length, 3, "Should render three radio inputs");
  assertEquals(radioLabels?.length, 3, "Should render three radio labels");
  assertEquals(
    radioGroup?.getAttribute("role"),
    "radiogroup",
    "Radio group should have correct role",
  );
});

Deno.test("BfDsRadio renders with fieldset when label provided", () => {
  const { doc } = render(
    <BfDsRadio
      name="size"
      label="Size Selection"
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const fieldset = doc?.querySelector("fieldset");
  const legend = doc?.querySelector("legend");

  assertExists(fieldset, "Fieldset should exist when label provided");
  assertExists(legend, "Legend should exist when label provided");
  assertEquals(
    legend?.textContent?.trim(),
    "Size Selection",
    "Legend should display correct text",
  );
  assertEquals(
    fieldset?.className,
    "bfds-radio-fieldset",
    "Fieldset should have correct class",
  );
});

Deno.test("BfDsRadio renders without fieldset when no label", () => {
  const { doc } = render(
    <BfDsRadio
      name="size"
      options={sampleOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const fieldset = doc?.querySelector("fieldset");
  const radioGroup = doc?.querySelector(".bfds-radio-group");

  assertEquals(fieldset, null, "Fieldset should not exist when no label");
  assertExists(radioGroup, "Radio group should still exist");
});

Deno.test("BfDsRadio renders with selected value", () => {
  const { doc } = render(
    <BfDsRadio
      name="size"
      options={sampleOptions}
      value="medium"
      onChange={() => {}}
    />,
  );

  const radioInputs = Array.from(
    doc?.querySelectorAll("input[type='radio']") || [],
  ) as unknown as Array<HTMLInputElement>;
  const mediumInput = Array.from(radioInputs).find((input) =>
    input.getAttribute("value") === "medium"
  );
  const checkedRadio = doc?.querySelector(".bfds-radio--checked");

  assertExists(mediumInput, "Medium radio input should exist");
  assertEquals(
    mediumInput?.hasAttribute("checked"),
    true,
    "Medium radio should be checked",
  );
  assertExists(checkedRadio, "Checked radio visual element should exist");
});

Deno.test("BfDsRadio renders with required attribute", () => {
  const { doc } = render(
    <BfDsRadio
      name="size"
      label="Required Size"
      options={sampleOptions}
      required
      value=""
      onChange={() => {}}
    />,
  );

  const legend = doc?.querySelector("legend");
  const requiredSpan = doc?.querySelector(".bfds-input-required");
  const firstRadio = doc?.querySelector(
    "input[type='radio']",
  ) as HTMLInputElement;

  assertExists(legend, "Legend should exist");
  assertExists(requiredSpan, "Required indicator should exist");
  assertExists(firstRadio, "First radio should exist");
  assertEquals(
    requiredSpan?.textContent,
    "*",
    "Required indicator should show asterisk",
  );
  assertEquals(
    firstRadio?.hasAttribute("required"),
    true,
    "First radio should have required attribute",
  );
});

Deno.test("BfDsRadio renders in disabled state", () => {
  const { doc } = render(
    <BfDsRadio
      name="size"
      options={sampleOptions}
      disabled
      value=""
      onChange={() => {}}
    />,
  );

  const radioGroup = doc?.querySelector(".bfds-radio-group");
  const radioInputs = Array.from(
    doc?.querySelectorAll("input[type='radio']") || [],
  ) as unknown as Array<HTMLInputElement>;

  assertExists(radioGroup, "Radio group should exist");
  assertEquals(
    radioGroup?.className.includes("bfds-radio-group--disabled"),
    true,
    "Radio group should have disabled class",
  );

  Array.from(radioInputs).forEach((input, index) => {
    assertEquals(
      input.hasAttribute("disabled"),
      true,
      `Radio input ${index + 1} should be disabled`,
    );
  });
});

Deno.test("BfDsRadio renders with mixed disabled options", () => {
  const { doc } = render(
    <BfDsRadio
      name="options"
      options={disabledOptions}
      value=""
      onChange={() => {}}
    />,
  );

  const radioInputs = Array.from(
    doc?.querySelectorAll("input[type='radio']") || [],
  ) as unknown as Array<HTMLInputElement>;
  const disabledRadios = doc?.querySelectorAll(".bfds-radio--disabled");

  assertEquals(radioInputs?.length, 3, "Should render three radio inputs");
  assertEquals(
    disabledRadios?.length,
    1,
    "Should have one disabled radio visual element",
  );

  assertEquals(
    radioInputs[0]?.hasAttribute("disabled"),
    false,
    "First radio should not be disabled",
  );
  assertEquals(
    radioInputs[1]?.hasAttribute("disabled"),
    true,
    "Second radio should be disabled",
  );
  assertEquals(
    radioInputs[2]?.hasAttribute("disabled"),
    false,
    "Third radio should not be disabled",
  );
});

Deno.test("BfDsRadio renders with different orientations", () => {
  const { doc: verticalDoc } = render(
    <BfDsRadio
      name="vertical"
      options={sampleOptions}
      orientation="vertical"
      value=""
      onChange={() => {}}
    />,
  );

  const { doc: horizontalDoc } = render(
    <BfDsRadio
      name="horizontal"
      options={sampleOptions}
      orientation="horizontal"
      value=""
      onChange={() => {}}
    />,
  );

  const verticalGroup = verticalDoc?.querySelector(".bfds-radio-group");
  const horizontalGroup = horizontalDoc?.querySelector(".bfds-radio-group");

  assertExists(verticalGroup, "Vertical radio group should exist");
  assertExists(horizontalGroup, "Horizontal radio group should exist");
  assertEquals(
    verticalGroup?.className.includes("bfds-radio-group--vertical"),
    true,
    "Vertical group should have vertical class",
  );
  assertEquals(
    horizontalGroup?.className.includes("bfds-radio-group--horizontal"),
    true,
    "Horizontal group should have horizontal class",
  );
});

Deno.test("BfDsRadio renders with different sizes", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(
      <BfDsRadio
        name={`size-${size}`}
        options={sampleOptions}
        size={size}
        value=""
        onChange={() => {}}
      />,
    );

    const radioGroup = doc?.querySelector(".bfds-radio-group");
    const radios = doc?.querySelectorAll(".bfds-radio");

    assertExists(radioGroup, `Radio group with ${size} size should exist`);
    assertEquals(
      radioGroup?.className.includes(`bfds-radio-group--${size}`),
      true,
      `Radio group should have ${size} class`,
    );

    Array.from(radios).forEach((radio, index) => {
      assertEquals(
        radio?.className.includes(`bfds-radio--${size}`),
        true,
        `Radio ${index + 1} should have ${size} class`,
      );
    });
  });
});

Deno.test("BfDsRadio renders with custom className", () => {
  const { doc } = render(
    <BfDsRadio
      name="custom"
      options={sampleOptions}
      className="custom-radio-class"
      value=""
      onChange={() => {}}
    />,
  );

  const radioGroup = doc?.querySelector(".bfds-radio-group");
  assertExists(radioGroup, "Radio group should exist");
  assertEquals(
    radioGroup?.className.includes("custom-radio-class"),
    true,
    "Radio group should include custom class",
  );
});

Deno.test("BfDsRadio accessibility attributes", () => {
  const { doc } = render(
    <BfDsRadio
      name="accessible"
      options={sampleOptions}
      value="medium"
      onChange={() => {}}
    />,
  );

  const radioInputs = doc?.querySelectorAll("input[type='radio']");
  const radioElements = doc?.querySelectorAll(".bfds-radio");
  const checkedRadio = doc?.querySelector(".bfds-radio--checked");

  assertExists(checkedRadio, "Checked radio visual element should exist");

  radioInputs.forEach((input, index) => {
    assertEquals(
      input?.getAttribute("name"),
      "accessible",
      `Radio input ${index + 1} should have correct name`,
    );
  });

  radioElements.forEach((radio, index) => {
    assertEquals(
      radio?.getAttribute("role"),
      "radio",
      `Radio element ${index + 1} should have radio role`,
    );
    const isChecked = radio?.className?.includes("bfds-radio--checked");
    assertEquals(
      radio?.getAttribute("aria-checked"),
      isChecked ? "true" : "false",
      `Radio element ${index + 1} should have correct aria-checked`,
    );
  });
});

Deno.test("BfDsRadio renders radio dot when checked", () => {
  const { doc } = render(
    <BfDsRadio
      name="checked"
      options={sampleOptions}
      value="large"
      onChange={() => {}}
    />,
  );

  const radioDots = doc?.querySelectorAll(".bfds-radio-dot");
  assertEquals(
    radioDots?.length,
    1,
    "Should have exactly one radio dot for checked option",
  );
});
