import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsRange } from "../BfDsRange.tsx";

Deno.test("BfDsRange - renders with label", () => {
  const { getByText } = render(<BfDsRange label="Test Range" />);
  const label = getByText("Test Range");
  assertExists(label);
});

Deno.test("BfDsRange - renders input with correct attributes", () => {
  const { doc } = render(
    <BfDsRange min={10} max={50} step={5} value={25} onChange={() => {}} />,
  );
  const input = doc?.querySelector('input[type="range"]');
  assertExists(input);
  assertEquals(input?.getAttribute("type"), "range");
  assertEquals(input?.getAttribute("min"), "10");
  assertEquals(input?.getAttribute("max"), "50");
  assertEquals(input?.getAttribute("step"), "5");
  assertEquals(input?.getAttribute("value"), "25");
});

Deno.test("BfDsRange - applies custom formatter to value display", () => {
  const { getByText } = render(
    <BfDsRange
      value={0.75}
      min={0}
      max={1}
      formatValue={(val) => `${Math.round(val * 100)}%`}
      onChange={() => {}}
    />,
  );
  const valueDisplay = getByText("75%");
  assertExists(valueDisplay);
});

Deno.test("BfDsRange - renders different sizes", () => {
  const { doc: small } = render(<BfDsRange size="small" />);
  const { doc: medium } = render(<BfDsRange size="medium" />);
  const { doc: large } = render(<BfDsRange size="large" />);

  assertExists(small?.querySelector(".bfds-range--small"));
  assertExists(medium?.querySelector(".bfds-range--medium"));
  assertExists(large?.querySelector(".bfds-range--large"));
});

Deno.test("BfDsRange - renders different states", () => {
  const { doc: error } = render(
    <BfDsRange state="error" errorMessage="Error!" />,
  );
  const { doc: success } = render(
    <BfDsRange state="success" successMessage="Success!" />,
  );
  const { doc: disabled } = render(<BfDsRange disabled />);

  assertExists(error?.querySelector(".bfds-range--error"));
  assertExists(success?.querySelector(".bfds-range--success"));
  assertExists(disabled?.querySelector(".bfds-range--disabled"));

  // Check that error and success messages are rendered
  assertExists(error?.querySelector(".bfds-range-error"));
  assertExists(success?.querySelector(".bfds-range-success"));
});

Deno.test("BfDsRange - displays help text", () => {
  const { getByText } = render(
    <BfDsRange helpText="This is helpful information" />,
  );
  const helpText = getByText("This is helpful information");
  assertExists(helpText);
});

Deno.test("BfDsRange - shows required indicator", () => {
  const { doc } = render(<BfDsRange label="Required Range" required />);
  const requiredIndicator = doc?.querySelector(".bfds-range-required");
  assertExists(requiredIndicator);
  assertEquals(requiredIndicator?.textContent, "*");
});

Deno.test("BfDsRange - renders tick marks when showTicks is true", () => {
  const { doc } = render(<BfDsRange showTicks />);
  const ticks = doc?.querySelector(".bfds-range-ticks");
  assertExists(ticks);
});

Deno.test("BfDsRange - renders custom tick labels", () => {
  const { getByText } = render(
    <BfDsRange
      showTicks
      tickLabels={[
        { value: 0, label: "Low" },
        { value: 50, label: "Medium" },
        { value: 100, label: "High" },
      ]}
    />,
  );

  assertExists(getByText("Low"));
  assertExists(getByText("Medium"));
  assertExists(getByText("High"));
});

Deno.test("BfDsRange - disabled input has disabled attribute", () => {
  const { doc } = render(<BfDsRange disabled />);
  const input = doc?.querySelector('input[type="range"]');
  assertExists(input);
  assertEquals(input?.getAttribute("disabled"), "");
});

Deno.test("BfDsRange - has proper ARIA attributes", () => {
  const { doc } = render(
    <BfDsRange
      label="Accessible Range"
      min={0}
      max={100}
      value={50}
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector('input[type="range"]');
  assertExists(input);
  assertEquals(input?.getAttribute("aria-valuemin"), "0");
  assertEquals(input?.getAttribute("aria-valuemax"), "100");
  assertEquals(input?.getAttribute("aria-valuenow"), "50");
  assertEquals(input?.getAttribute("aria-valuetext"), "50");
});

Deno.test("BfDsRange - custom formatValue affects aria-valuetext", () => {
  const { doc } = render(
    <BfDsRange
      label="Percentage"
      min={0}
      max={1}
      value={0.5}
      formatValue={(val) => `${Math.round(val * 100)}%`}
      onChange={() => {}}
    />,
  );

  const input = doc?.querySelector('input[type="range"]');
  assertExists(input);
  assertEquals(input?.getAttribute("aria-valuetext"), "50%");
});

Deno.test("BfDsRange - renders with custom color style", () => {
  const { doc } = render(<BfDsRange color="#ff0000" value={50} />);
  const input = doc?.querySelector('input[type="range"]');
  const fill = doc?.querySelector(".bfds-range-fill");

  assertExists(input);
  assertExists(fill);

  // Check that custom color CSS variable is set on input
  const inputStyle = input?.getAttribute("style");
  assertExists(inputStyle);
  assertEquals(inputStyle.includes("--bfds-range-custom-color:#ff0000"), true);

  // Check that fill has custom background color in style attribute
  const fillStyle = fill?.getAttribute("style");
  assertExists(fillStyle);
  assertEquals(fillStyle.includes("background-color:#ff0000"), true);
});

Deno.test("BfDsRange - hides value display when showValue is false", () => {
  const { doc } = render(<BfDsRange showValue={false} value={75} />);
  const valueDisplay = doc?.querySelector(".bfds-range-value");
  assertEquals(valueDisplay, null);
});

Deno.test("BfDsRange - shows value display by default", () => {
  const { doc } = render(<BfDsRange value={75} />);
  const valueDisplay = doc?.querySelector(".bfds-range-value");
  assertExists(valueDisplay);
  assertEquals(valueDisplay?.textContent, "75");
});
