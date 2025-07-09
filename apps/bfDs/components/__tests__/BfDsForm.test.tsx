import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsForm, useBfDsFormContext } from "../BfDsForm.tsx";
import { BfDsButton } from "../BfDsButton.tsx";

// Helper component to test the form context
function FormContextDisplay() {
  const formContext = useBfDsFormContext<{ name: string; age: number }>();
  return (
    <div>
      <span data-testid="form-data">
        {formContext?.data
          ? `${formContext.data.name}-${formContext.data.age}`
          : "no-data"}
      </span>
      <span data-testid="has-context">
        {formContext ? "has-context" : "no-context"}
      </span>
    </div>
  );
}

// Mock input component that uses form context
function MockFormInput({ name }: { name: string }) {
  const formContext = useBfDsFormContext<Record<string, string>>();
  const value = formContext?.data?.[name] || "";

  return (
    <input
      name={name}
      value={value}
      data-testid={`input-${name}`}
      onChange={() => {}} // Mock handler
    />
  );
}

Deno.test("BfDsForm renders with initial data", () => {
  const initialData = { name: "Test User", age: 30 };
  const { doc } = render(
    <BfDsForm initialData={initialData}>
      <FormContextDisplay />
    </BfDsForm>,
  );

  const formElement = doc?.querySelector("form");
  const formDataElement = doc?.querySelector("[data-testid='form-data']");

  assertExists(formElement, "Form element should exist");
  assertExists(formDataElement, "Form data element should exist");
  assertEquals(
    formDataElement?.textContent,
    "Test User-30",
    "Form should display the initial data",
  );
});

Deno.test("BfDsForm provides context to child components", () => {
  const initialData = { name: "Context Test" };
  const { doc } = render(
    <BfDsForm initialData={initialData}>
      <FormContextDisplay />
    </BfDsForm>,
  );

  const contextElement = doc?.querySelector("[data-testid='has-context']");
  assertExists(contextElement, "Context element should exist");
  assertEquals(
    contextElement?.textContent,
    "has-context",
    "Form should provide context to children",
  );
});

Deno.test("BfDsForm renders with custom className", () => {
  const { doc } = render(
    <BfDsForm initialData={{}} className="custom-form-class">
      <div>Form content</div>
    </BfDsForm>,
  );

  const formElement = doc?.querySelector("form");
  assertExists(formElement, "Form element should exist");
  assertEquals(
    formElement?.className?.includes("custom-form-class"),
    true,
    "Form should include custom class",
  );
  assertEquals(
    formElement?.className?.includes("bfds-form"),
    true,
    "Form should include base class",
  );
});

Deno.test("BfDsForm renders with test ID", () => {
  const { doc } = render(
    <BfDsForm initialData={{}} testId="test-form">
      <div>Form content</div>
    </BfDsForm>,
  );

  const formElement = doc?.querySelector("form");
  assertExists(formElement, "Form element should exist");
  assertEquals(
    formElement?.getAttribute("data-testid"),
    "test-form",
    "Form should have test ID attribute",
  );
});

Deno.test("BfDsForm renders form inputs with context values", () => {
  const initialData = { name: "John", email: "john@example.com" };
  const { doc } = render(
    <BfDsForm initialData={initialData}>
      <MockFormInput name="name" />
      <MockFormInput name="email" />
    </BfDsForm>,
  );

  const nameInput = doc?.querySelector(
    "[data-testid='input-name']",
  ) as HTMLInputElement;
  const emailInput = doc?.querySelector(
    "[data-testid='input-email']",
  ) as HTMLInputElement;

  assertExists(nameInput, "Name input should exist");
  assertExists(emailInput, "Email input should exist");
  assertEquals(
    nameInput?.getAttribute("value"),
    "John",
    "Name input should have correct value from context",
  );
  assertEquals(
    emailInput?.getAttribute("value"),
    "john@example.com",
    "Email input should have correct value from context",
  );
});

Deno.test("BfDsForm handles empty initial data", () => {
  const { doc } = render(
    <BfDsForm initialData={{}}>
      <FormContextDisplay />
    </BfDsForm>,
  );

  const formElement = doc?.querySelector("form");
  const contextElement = doc?.querySelector("[data-testid='has-context']");

  assertExists(formElement, "Form element should exist");
  assertExists(contextElement, "Context element should exist");
  assertEquals(
    contextElement?.textContent,
    "has-context",
    "Form should still provide context with empty data",
  );
});

Deno.test("BfDsForm default classes", () => {
  const { doc } = render(
    <BfDsForm initialData={{}}>
      <div>Content</div>
    </BfDsForm>,
  );

  const formElement = doc?.querySelector("form");
  assertExists(formElement, "Form element should exist");
  assertEquals(
    formElement?.className,
    "bfds-form",
    "Form should have default class",
  );
});

Deno.test("useBfDsFormContext returns null outside form", () => {
  const { doc } = render(<FormContextDisplay />);

  const contextElement = doc?.querySelector("[data-testid='has-context']");
  assertExists(contextElement, "Context element should exist");
  assertEquals(
    contextElement?.textContent,
    "no-context",
    "Context should be null outside of form",
  );
});

Deno.test("BfDsForm renders children correctly", () => {
  const { doc } = render(
    <BfDsForm initialData={{}}>
      <div data-testid="child-element">Child content</div>
      <span data-testid="second-child">Second child</span>
    </BfDsForm>,
  );

  const firstChild = doc?.querySelector("[data-testid='child-element']");
  const secondChild = doc?.querySelector("[data-testid='second-child']");

  assertExists(firstChild, "First child should be rendered");
  assertExists(secondChild, "Second child should be rendered");
  assertEquals(
    firstChild?.textContent,
    "Child content",
    "First child should have correct content",
  );
  assertEquals(
    secondChild?.textContent,
    "Second child",
    "Second child should have correct content",
  );
});

Deno.test("BfDsButton has type='button' by default to prevent form submission", () => {
  const { doc } = render(
    <BfDsForm initialData={{}}>
      <BfDsButton>Regular Button</BfDsButton>
    </BfDsForm>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button should exist");
  
  // Verify button has type="button" to prevent accidental form submission
  assertEquals(
    button?.getAttribute("type"),
    "button",
    "BfDsButton should have type='button' by default to prevent form submission",
  );
});
