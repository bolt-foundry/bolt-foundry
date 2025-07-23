import { assertEquals, assertExists } from "@std/assert";
import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";
import { BfDsRange } from "../BfDsRange.tsx";
import { BfDsForm } from "../BfDsForm.tsx";

Deno.test("BfDsRange - renders with label", () => {
  render(<BfDsRange label="Test Range" />);
  const label = screen.getByText("Test Range");
  assertExists(label);
});

Deno.test("BfDsRange - renders with required indicator", () => {
  render(<BfDsRange label="Required Range" required />);
  const required = screen.getByText("*");
  assertExists(required);
});

Deno.test("BfDsRange - shows value display by default", () => {
  render(<BfDsRange value={75} onChange={() => {}} />);
  const valueDisplay = screen.getByText("75");
  assertExists(valueDisplay);
});

Deno.test("BfDsRange - hides value display when showValue is false", () => {
  render(<BfDsRange value={75} showValue={false} onChange={() => {}} />);
  const valueDisplay = screen.queryByText("75");
  assertEquals(valueDisplay, null);
});

Deno.test("BfDsRange - applies custom formatter", () => {
  render(
    <BfDsRange
      value={0.75}
      min={0}
      max={1}
      formatValue={(val) => `${Math.round(val * 100)}%`}
      onChange={() => {}}
    />
  );
  const valueDisplay = screen.getByText("75%");
  assertExists(valueDisplay);
});

Deno.test("BfDsRange - renders different sizes", () => {
  const { container: small } = render(<BfDsRange size="small" />);
  const { container: medium } = render(<BfDsRange size="medium" />);
  const { container: large } = render(<BfDsRange size="large" />);

  assertExists(small.querySelector(".bfds-range--small"));
  assertExists(medium.querySelector(".bfds-range--medium"));
  assertExists(large.querySelector(".bfds-range--large"));
});

Deno.test("BfDsRange - renders different states", () => {
  const { container: error } = render(<BfDsRange state="error" errorMessage="Error!" />);
  const { container: success } = render(<BfDsRange state="success" successMessage="Success!" />);
  const { container: disabled } = render(<BfDsRange disabled />);

  assertExists(error.querySelector(".bfds-range--error"));
  assertExists(success.querySelector(".bfds-range--success"));
  assertExists(disabled.querySelector(".bfds-range--disabled"));
});

Deno.test("BfDsRange - displays help text", () => {
  render(<BfDsRange helpText="This is help text" />);
  const helpText = screen.getByText("This is help text");
  assertExists(helpText);
});

Deno.test("BfDsRange - displays error message", () => {
  render(<BfDsRange state="error" errorMessage="This is an error" />);
  const errorMessage = screen.getByText("This is an error");
  assertExists(errorMessage);
});

Deno.test("BfDsRange - displays success message", () => {
  render(<BfDsRange state="success" successMessage="This is success" />);
  const successMessage = screen.getByText("This is success");
  assertExists(successMessage);
});

Deno.test("BfDsRange - handles value changes", () => {
  let value = 50;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    value = Number(e.target.value);
  };

  render(<BfDsRange value={value} onChange={handleChange} />);
  const input = screen.getByRole("slider") as HTMLInputElement;
  
  fireEvent.change(input, { target: { value: "75" } });
  assertEquals(value, 75);
});

Deno.test("BfDsRange - respects min/max/step", () => {
  render(<BfDsRange min={10} max={50} step={5} value={25} onChange={() => {}} />);
  const input = screen.getByRole("slider") as HTMLInputElement;
  
  assertEquals(input.min, "10");
  assertEquals(input.max, "50");
  assertEquals(input.step, "5");
  assertEquals(input.value, "25");
});

Deno.test("BfDsRange - renders tick marks when showTicks is true", () => {
  const { container } = render(<BfDsRange showTicks />);
  const ticks = container.querySelector(".bfds-range-ticks");
  assertExists(ticks);
});

Deno.test("BfDsRange - renders custom tick labels", () => {
  render(
    <BfDsRange
      showTicks
      tickLabels={[
        { value: 0, label: "Low" },
        { value: 50, label: "Medium" },
        { value: 100, label: "High" },
      ]}
    />
  );
  
  assertExists(screen.getByText("Low"));
  assertExists(screen.getByText("Medium"));
  assertExists(screen.getByText("High"));
});

Deno.test("BfDsRange - works in form context", () => {
  let formData: Record<string, unknown> | null = null;
  
  render(
    <BfDsForm onSubmit={(data) => { formData = data; }}>
      <BfDsRange name="volume" label="Volume" min={0} max={100} />
      <button type="submit">Submit</button>
    </BfDsForm>
  );
  
  const input = screen.getByLabelText("Volume") as HTMLInputElement;
  fireEvent.change(input, { target: { value: "75" } });
  
  const submitButton = screen.getByText("Submit");
  fireEvent.click(submitButton);
  
  assertEquals(formData?.volume, 75);
});

Deno.test("BfDsRange - disabled state prevents interaction", () => {
  let value = 50;
  const handleChange = () => { value = 100; };
  
  render(<BfDsRange disabled value={value} onChange={handleChange} />);
  const input = screen.getByRole("slider") as HTMLInputElement;
  
  assertEquals(input.disabled, true);
  fireEvent.change(input, { target: { value: "100" } });
  assertEquals(value, 50); // Value should not change
});

Deno.test("BfDsRange - has proper ARIA attributes", () => {
  render(
    <BfDsRange
      label="Accessible Range"
      min={0}
      max={100}
      value={50}
      onChange={() => {}}
    />
  );
  
  const input = screen.getByLabelText("Accessible Range");
  assertEquals(input.getAttribute("aria-valuemin"), "0");
  assertEquals(input.getAttribute("aria-valuemax"), "100");
  assertEquals(input.getAttribute("aria-valuenow"), "50");
  assertEquals(input.getAttribute("aria-valuetext"), "50");
});

Deno.test("BfDsRange - custom formatValue affects aria-valuetext", () => {
  render(
    <BfDsRange
      label="Percentage"
      min={0}
      max={1}
      value={0.5}
      formatValue={(val) => `${Math.round(val * 100)}%`}
      onChange={() => {}}
    />
  );
  
  const input = screen.getByLabelText("Percentage");
  assertEquals(input.getAttribute("aria-valuetext"), "50%");
});
