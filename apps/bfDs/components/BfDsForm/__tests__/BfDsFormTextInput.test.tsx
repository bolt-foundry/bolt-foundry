import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsFormTextInput } from "../BfDsFormTextInput.tsx";

Deno.test("BfDsFormTextInput renders with correct label and value", () => {
  const initialData = { username: "testuser" };
  const { doc, getByText } = render(
    <BfDsForm initialData={initialData}>
      <BfDsFormTextInput id="username" title="Username" />
    </BfDsForm>,
  );

  // Check if label is rendered correctly
  const label = getByText("Username");
  assertExists(label, "Label should exist");

  // Check if input is rendered with the correct value
  const input = doc?.querySelector("input[name='username']");
  assertExists(input, "Input element should exist");
  assertEquals(
    input?.getAttribute("value"),
    "testuser",
    "Input should have the correct value from initialData",
  );
});

Deno.test("BfDsFormTextInput supports placeholder", () => {
  const initialData = { email: "" };
  const { doc } = render(
    <BfDsForm initialData={initialData}>
      <BfDsFormTextInput
        id="email"
        title="Email"
        placeholder="Enter your email"
      />
    </BfDsForm>,
  );

  const input = doc?.querySelector("input[name='email']");
  assertExists(input, "Input element should exist");
  assertEquals(
    input?.getAttribute("placeholder"),
    "Enter your email",
    "Input should have the correct placeholder",
  );
});
