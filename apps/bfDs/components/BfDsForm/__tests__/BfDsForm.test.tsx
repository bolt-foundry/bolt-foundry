import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsForm, useBfDsFormContext } from "../BfDsForm.tsx";
import { BfDsFormTextInput } from "../BfDsFormTextInput.tsx";
import { BfDsFormNumberInput } from "../BfDsFormNumberInput.tsx";
import { BfDsFormToggle } from "../BfDsFormToggle.tsx";
import { BfDsFormTextArea } from "../BfDsFormTextArea.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

// Helper component to test the form context
function FormContextDisplay() {
  const { data } = useBfDsFormContext<{ name: string; age: number }>();
  return (
    <div>
      <span data-testid="form-data">
        {data ? `${data.name}-${data.age}` : "no-data"}
      </span>
    </div>
  );
}

Deno.test("BfDsForm renders with initial data", () => {
  const initialData = { name: "Test User", age: 30 };
  const { doc } = render(
    <BfDsForm initialData={initialData}>
      <FormContextDisplay />
    </BfDsForm>,
  );

  const formDataElement = doc?.querySelector("[data-testid='form-data']");
  assertExists(formDataElement, "Form data element should exist");
  assertEquals(
    formDataElement?.textContent,
    "Test User-30",
    "Form should display the initial data",
  );
});

Deno.test("BfDsForm renders form elements correctly", () => {
  const initialData = {
    name: "Test User",
    age: 30,
    isActive: true,
    bio: "Hello",
  };
  const { doc } = render(
    <BfDsForm initialData={initialData}>
      <BfDsFormTextInput id="name" title="Name" />
      <BfDsFormNumberInput id="age" title="Age" />
      <BfDsFormToggle id="isActive" title="Active" />
      <BfDsFormTextArea id="bio" title="Bio" />
      <BfDsFormSubmitButton text="Submit" />
    </BfDsForm>,
  );

  // Check if form element exists
  const formElement = doc?.querySelector("form");
  assertExists(formElement, "Form element should exist");

  // Check if all form inputs are rendered
  const nameInput = doc?.querySelector("input[name='name']");
  assertExists(nameInput, "Name input should exist");
  assertEquals(
    nameInput?.getAttribute("value"),
    "Test User",
    "Name input should have the correct value",
  );

  const ageInput = doc?.querySelector("input[name='age']");
  assertExists(ageInput, "Age input should exist");
  assertEquals(
    ageInput?.getAttribute("value"),
    "30",
    "Age input should have the correct value",
  );

  const submitButton = doc?.querySelector("button[type='submit']");
  assertExists(submitButton, "Submit button should exist");
  assertEquals(
    submitButton?.textContent,
    "Submit",
    "Submit button should have the correct text",
  );
});

Deno.test("BfDsForm renders with custom styles", () => {
  const initialData = { name: "Test User" };
  const customStyle = { padding: "20px", backgroundColor: "lightgray" };
  const { doc } = render(
    <BfDsForm initialData={initialData} xstyle={customStyle}>
      <div>Form content</div>
    </BfDsForm>,
  );

  const formElement = doc?.querySelector("form");
  assertExists(formElement, "Form element should exist");

  const formStyle = formElement?.getAttribute("style");
  assertExists(formStyle, "Form should have style attribute");

  // The exact style syntax might vary in the string representation
  // So we'll check for the presence of the key style properties
  assertEquals(
    formStyle?.includes("padding") && formStyle?.includes("20px"),
    true,
    "Form should have custom padding style",
  );
  assertEquals(
    (formStyle?.includes("background-color") ||
      formStyle?.includes("backgroundColor")) &&
      formStyle?.includes("lightgray"),
    true,
    "Form should have custom background color style",
  );
});
