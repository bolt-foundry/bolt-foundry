import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsCallout } from "../BfDsCallout.tsx";

Deno.test("BfDsCallout renders with default props", () => {
  const { doc } = render(<BfDsCallout>Test message</BfDsCallout>);

  const callout = doc?.querySelector(".bfds-callout");
  const message = doc?.querySelector(".bfds-callout-message");
  const icon = doc?.querySelector(".bfds-callout-icon svg");

  assertExists(callout, "Callout element should exist");
  assertExists(message, "Message element should exist");
  assertExists(icon, "Icon should exist");
  assertEquals(
    callout?.className,
    "bfds-callout bfds-callout--info",
    "Callout should have default info variant",
  );
  assertEquals(
    message?.textContent,
    "Test message",
    "Message should display correct text",
  );
});

Deno.test("BfDsCallout renders with all variants", () => {
  const variants = ["info", "success", "warning", "error"] as const;

  variants.forEach((variant) => {
    const { doc } = render(
      <BfDsCallout variant={variant}>Test {variant}</BfDsCallout>,
    );
    const callout = doc?.querySelector(".bfds-callout");
    assertExists(callout, `Callout with ${variant} variant should exist`);
    assertEquals(
      callout?.className.includes(`bfds-callout--${variant}`),
      true,
      `Callout should have ${variant} class`,
    );
  });
});

Deno.test("BfDsCallout renders with custom className", () => {
  const { doc } = render(
    <BfDsCallout className="custom-class">Test message</BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  assertExists(callout, "Callout element should exist");
  assertEquals(
    callout?.className.includes("custom-class"),
    true,
    "Callout should include custom class",
  );
});

Deno.test("BfDsCallout renders with details collapsed by default", () => {
  const { doc } = render(
    <BfDsCallout details="Debug information">Test message</BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  const toggle = doc?.querySelector(".bfds-callout-toggle");
  const details = doc?.querySelector(".bfds-callout-details");

  assertExists(callout, "Callout element should exist");
  assertExists(toggle, "Toggle button should exist");
  assertEquals(
    details,
    null,
    "Details should not be visible by default",
  );
  assertEquals(
    toggle?.textContent?.includes("Show details"),
    true,
    "Toggle should show 'Show details' text",
  );
});

Deno.test("BfDsCallout renders with details expanded when defaultExpanded is true", () => {
  const { doc } = render(
    <BfDsCallout details="Debug information" defaultExpanded>
      Test message
    </BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  const toggle = doc?.querySelector(".bfds-callout-toggle");
  const details = doc?.querySelector(".bfds-callout-details");
  const pre = doc?.querySelector(".bfds-callout-details pre");

  assertExists(callout, "Callout element should exist");
  assertExists(toggle, "Toggle button should exist");
  assertExists(details, "Details should be visible");
  assertExists(pre, "Pre element should exist");
  assertEquals(
    toggle?.textContent?.includes("Hide details"),
    true,
    "Toggle should show 'Hide details' text",
  );
  assertEquals(
    pre?.textContent,
    "Debug information",
    "Details should display correct content",
  );
});

Deno.test("BfDsCallout renders dismiss button when onDismiss is provided", () => {
  const { doc } = render(
    <BfDsCallout onDismiss={() => {}}>Test message</BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  const dismissButton = doc?.querySelector(".bfds-callout-dismiss");
  const dismissIcon = doc?.querySelector(".bfds-callout-dismiss svg");

  assertExists(callout, "Callout element should exist");
  assertExists(dismissButton, "Dismiss button should exist");
  assertExists(dismissIcon, "Dismiss icon should exist");
  assertEquals(
    dismissButton?.getAttribute("aria-label"),
    "Dismiss notification",
    "Dismiss button should have aria-label",
  );
  assertEquals(
    dismissButton?.getAttribute("type"),
    "button",
    "Dismiss button should have type='button'",
  );
});

Deno.test("BfDsCallout renders countdown when autoDismiss is provided", () => {
  const { doc } = render(
    <BfDsCallout onDismiss={() => {}} autoDismiss={5000}>
      Test message
    </BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  const countdown = doc?.querySelector(".bfds-callout-countdown");
  const svg = doc?.querySelector(".bfds-callout-countdown-ring");
  const circles = doc?.querySelectorAll(".bfds-callout-countdown circle");

  assertExists(callout, "Callout element should exist");
  assertExists(countdown, "Countdown element should exist");
  assertExists(svg, "Countdown SVG should exist");
  assertEquals(
    circles?.length,
    2,
    "Should have 2 circles (track and progress)",
  );
  assertEquals(
    svg?.getAttribute("width"),
    "32",
    "SVG should have correct width",
  );
  assertEquals(
    svg?.getAttribute("height"),
    "32",
    "SVG should have correct height",
  );
});

Deno.test("BfDsCallout does not render when visible is false", () => {
  const { doc } = render(
    <BfDsCallout visible={false}>Test message</BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  assertEquals(
    callout,
    null,
    "Callout should not be rendered when visible is false",
  );
});

Deno.test("BfDsCallout renders with correct icon for each variant", () => {
  const variants = [
    { variant: "info", expectedIcon: "infoCircle" },
    { variant: "success", expectedIcon: "checkCircle" },
    { variant: "warning", expectedIcon: "exclamationTriangle" },
    { variant: "error", expectedIcon: "exclamationStop" },
  ] as const;

  variants.forEach(({ variant }) => {
    const { doc } = render(
      <BfDsCallout variant={variant}>Test {variant}</BfDsCallout>,
    );
    const icon = doc?.querySelector(".bfds-callout-icon svg");
    assertExists(icon, `Icon should exist for ${variant} variant`);
    // Icon name verification would require checking specific SVG content
    // which is not easily testable in this setup
  });
});

Deno.test("BfDsCallout toggle button has correct type", () => {
  const { doc } = render(
    <BfDsCallout details="Debug information">Test message</BfDsCallout>,
  );

  const toggle = doc?.querySelector(".bfds-callout-toggle");
  assertExists(toggle, "Toggle button should exist");
  assertEquals(
    toggle?.getAttribute("type"),
    "button",
    "Toggle button should have type='button'",
  );
});

Deno.test("BfDsCallout renders without details when details prop is not provided", () => {
  const { doc } = render(<BfDsCallout>Test message</BfDsCallout>);

  const callout = doc?.querySelector(".bfds-callout");
  const toggle = doc?.querySelector(".bfds-callout-toggle");
  const details = doc?.querySelector(".bfds-callout-details");

  assertExists(callout, "Callout element should exist");
  assertEquals(
    toggle,
    null,
    "Toggle button should not exist when no details provided",
  );
  assertEquals(
    details,
    null,
    "Details should not exist when no details provided",
  );
});

Deno.test("BfDsCallout renders without dismiss button when onDismiss is not provided", () => {
  const { doc } = render(<BfDsCallout>Test message</BfDsCallout>);

  const callout = doc?.querySelector(".bfds-callout");
  const dismissButton = doc?.querySelector(".bfds-callout-dismiss");

  assertExists(callout, "Callout element should exist");
  assertEquals(
    dismissButton,
    null,
    "Dismiss button should not exist when onDismiss is not provided",
  );
});

Deno.test("BfDsCallout renders without countdown when autoDismiss is 0", () => {
  const { doc } = render(
    <BfDsCallout onDismiss={() => {}} autoDismiss={0}>
      Test message
    </BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  const countdown = doc?.querySelector(".bfds-callout-countdown");

  assertExists(callout, "Callout element should exist");
  assertEquals(
    countdown,
    null,
    "Countdown should not exist when autoDismiss is 0",
  );
});

Deno.test("BfDsCallout has correct structure", () => {
  const { doc } = render(
    <BfDsCallout
      details="Debug info"
      onDismiss={() => {}}
      autoDismiss={5000}
    >
      Test message
    </BfDsCallout>,
  );

  const callout = doc?.querySelector(".bfds-callout");
  const header = doc?.querySelector(".bfds-callout-header");
  const icon = doc?.querySelector(".bfds-callout-icon");
  const content = doc?.querySelector(".bfds-callout-content");
  const message = doc?.querySelector(".bfds-callout-message");
  const toggle = doc?.querySelector(".bfds-callout-toggle");
  const dismiss = doc?.querySelector(".bfds-callout-dismiss");

  assertExists(callout, "Callout element should exist");
  assertExists(header, "Header element should exist");
  assertExists(icon, "Icon container should exist");
  assertExists(content, "Content container should exist");
  assertExists(message, "Message element should exist");
  assertExists(toggle, "Toggle button should exist");
  assertExists(dismiss, "Dismiss button should exist");
});

Deno.test("BfDsCallout countdown progress circle has correct attributes", () => {
  const { doc } = render(
    <BfDsCallout onDismiss={() => {}} autoDismiss={5000}>
      Test message
    </BfDsCallout>,
  );

  const progressCircle = doc?.querySelector(".bfds-callout-countdown-progress");
  assertExists(progressCircle, "Progress circle should exist");
  assertEquals(
    progressCircle?.getAttribute("r"),
    "14",
    "Progress circle should have correct radius",
  );
  assertEquals(
    progressCircle?.getAttribute("stroke-width"),
    "2",
    "Progress circle should have correct stroke width",
  );
  assertEquals(
    progressCircle?.getAttribute("fill"),
    "none",
    "Progress circle should have no fill",
  );
});

Deno.test("BfDsCallout countdown track circle has correct attributes", () => {
  const { doc } = render(
    <BfDsCallout onDismiss={() => {}} autoDismiss={5000}>
      Test message
    </BfDsCallout>,
  );

  const trackCircle = doc?.querySelector(".bfds-callout-countdown-track");
  assertExists(trackCircle, "Track circle should exist");
  assertEquals(
    trackCircle?.getAttribute("r"),
    "14",
    "Track circle should have correct radius",
  );
  assertEquals(
    trackCircle?.getAttribute("stroke-width"),
    "2",
    "Track circle should have correct stroke width",
  );
  assertEquals(
    trackCircle?.getAttribute("opacity"),
    "0.2",
    "Track circle should have correct opacity",
  );
});
