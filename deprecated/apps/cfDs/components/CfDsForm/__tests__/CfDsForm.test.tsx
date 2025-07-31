import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { CfDsForm, useCfDsFormContext } from "../CfDsForm.tsx";
import { CfDsFormTextInput } from "../CfDsFormTextInput.tsx";
import { CfDsFormNumberInput } from "../CfDsFormNumberInput.tsx";
import { CfDsFormToggle } from "../CfDsFormToggle.tsx";
import { CfDsFormTextArea } from "../CfDsFormTextArea.tsx";
import { CfDsFormSubmitButton } from "../CfDsFormSubmitButton.tsx";

// Helper component to test the form context
function FormContextDisplay() {
  const { data } = useCfDsFormContext<{ name: string; age: number }>();
  return (
    <div>
      <span data-testid="form-data">
        {data ? `${data.name}-${data.age}` : "no-data"}
      </span>
    </div>
  );
}

Deno.test("CfDsForm renders with initial data", () => {
  const initialData = { name: "Test User", age: 30 };
  const { doc } = render(
    <CfDsForm initialData={initialData}>
      <FormContextDisplay />
    </CfDsForm>,
  );

  const formDataElement = doc?.querySelector("[data-testid='form-data']");
  assertExists(formDataElement, "Form data element should exist");
  assertEquals(
    formDataElement?.textContent,
    "Test User-30",
    "Form should display the initial data",
  );
});

Deno.test("CfDsForm renders form elements correctly", () => {
  const initialData = {
    name: "Test User",
    age: 30,
    isActive: true,
    bio: "Hello",
  };
  const { doc } = render(
    <CfDsForm initialData={initialData}>
      <CfDsFormTextInput id="name" title="Name" />
      <CfDsFormNumberInput id="age" title="Age" />
      <CfDsFormToggle id="isActive" title="Active" />
      <CfDsFormTextArea id="bio" title="Bio" />
      <CfDsFormSubmitButton text="Submit" />
    </CfDsForm>,
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

Deno.test("CfDsForm renders with custom styles", () => {
  const initialData = { name: "Test User" };
  const customStyle = { padding: "20px", backgroundColor: "lightgray" };
  const { doc } = render(
    <CfDsForm initialData={initialData} xstyle={customStyle}>
      <div>Form content</div>
    </CfDsForm>,
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
