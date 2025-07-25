import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { CfDsCallout } from "../CfDsCallout.tsx";
import { CfDsButton } from "../CfDsButton.tsx";

Deno.test("CfDsCallout renders with header and body text", () => {
  const headerText = "Information Header";
  const bodyText = "This is important information for the user.";
  const { getByText } = render(
    <CfDsCallout kind="info" header={headerText} body={bodyText} />,
  );

  const header = getByText(headerText);
  const body = getByText(bodyText);

  assertExists(header, `Header with text "${headerText}" should exist`);
  assertExists(body, `Body with text "${bodyText}" should exist`);
});

Deno.test("CfDsCallout renders with correct kind (info)", () => {
  const { doc } = render(
    <CfDsCallout kind="info" header="Info Header" body="Info message" />,
  );

  const calloutElement = doc?.querySelector(".callout");
  assertExists(calloutElement, "Callout element should exist");
  assertEquals(
    calloutElement?.classList.contains("info"),
    true,
    "Callout should have 'info' class",
  );
});

Deno.test("CfDsCallout renders with correct kind (warning)", () => {
  const { doc } = render(
    <CfDsCallout
      kind="warning"
      header="Warning Header"
      body="Warning message"
    />,
  );

  const calloutElement = doc?.querySelector(".callout");
  assertExists(calloutElement, "Callout element should exist");
  assertEquals(
    calloutElement?.classList.contains("warning"),
    true,
    "Callout should have 'warning' class",
  );
});

Deno.test("CfDsCallout renders with correct kind (error)", () => {
  const { doc } = render(
    <CfDsCallout kind="error" header="Error Header" body="Error message" />,
  );

  const calloutElement = doc?.querySelector(".callout");
  assertExists(calloutElement, "Callout element should exist");
  assertEquals(
    calloutElement?.classList.contains("error"),
    true,
    "Callout should have 'error' class",
  );
});

Deno.test("CfDsCallout renders with correct kind (success)", () => {
  const { doc } = render(
    <CfDsCallout
      kind="success"
      header="Success Header"
      body="Success message"
    />,
  );

  const calloutElement = doc?.querySelector(".callout");
  assertExists(calloutElement, "Callout element should exist");
  assertEquals(
    calloutElement?.classList.contains("success"),
    true,
    "Callout should have 'success' class",
  );
});

Deno.test("CfDsCallout renders with action element", () => {
  const actionText = "Click Me";
  const { getByText } = render(
    <CfDsCallout
      kind="info"
      header="Header"
      body="Message"
      action={<CfDsButton text={actionText} />}
    />,
  );

  const actionButton = getByText(actionText);
  assertExists(
    actionButton,
    `Action button with text "${actionText}" should exist`,
  );
});
