import { render } from "infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsButton } from "../BfDsButton.tsx";
import { BfDsButtonGroup } from "../BfDsButtonGroup.tsx";

Deno.test("BfDsButtonGroup renders all buttons", () => {
  const { doc } = render(
    <BfDsButtonGroup
      buttons={[
        <BfDsButton key="left" text="Left" kind="primary" />,
        <BfDsButton key="middle" text="Middle" kind="primary" />,
        <BfDsButton key="right" text="Right" kind="primary" />,
      ]}
    />,
  );

  const buttons = doc?.querySelectorAll("button");
  assertExists(buttons, "Buttons should exist");
  assertEquals(buttons.length, 3, "Should render 3 buttons");
});

Deno.test("BfDsButtonGroup renders with correct container styling", () => {
  const { doc } = render(
    <BfDsButtonGroup
      buttons={[
        <BfDsButton key="btn1" text="Button 1" />,
        <BfDsButton key="btn2" text="Button 2" />,
      ]}
    />,
  );

  const buttonGroup = doc?.querySelector("div");
  assertExists(buttonGroup, "Button group container should exist");

  const style = buttonGroup?.getAttribute("style");
  assertExists(style, "Button group should have style attribute");
  assertEquals(
    style?.includes("display: flex") && style?.includes("flex-direction: row"),
    true,
    "Button group should have flex row layout",
  );
});

Deno.test("BfDsButtonGroup applies correct border radius to first and last buttons", () => {
  const { doc } = render(
    <BfDsButtonGroup
      buttons={[
        <BfDsButton key="first" text="First" />,
        <BfDsButton key="middle" text="Middle" />,
        <BfDsButton key="last" text="Last" />,
      ]}
    />,
  );

  const buttons = Array.from(doc?.querySelectorAll("button") || []);
  assertEquals(buttons.length, 3, "Should render 3 buttons");

  // Check first button has left border radius
  const firstButtonStyle = buttons[0]?.getAttribute("style");
  assertExists(firstButtonStyle, "First button should have style attribute");
  assertEquals(
    firstButtonStyle?.includes("border-radius: 6px 0 0 6px"),
    true,
    "First button should have left border radius",
  );

  // Check middle button has no border radius
  const middleButtonStyle = buttons[1]?.getAttribute("style");
  assertExists(middleButtonStyle, "Middle button should have style attribute");
  assertEquals(
    middleButtonStyle?.includes("border-radius: 0"),
    true,
    "Middle button should have no border radius",
  );

  // Check last button has right border radius
  const lastButtonStyle = buttons[2]?.getAttribute("style");
  assertExists(lastButtonStyle, "Last button should have style attribute");
  assertEquals(
    lastButtonStyle?.includes("border-radius: 0 6px 6px 0"),
    true,
    "Last button should have right border radius",
  );
});
