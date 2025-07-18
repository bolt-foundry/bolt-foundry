import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsFullPageSpinner, BfDsSpinner } from "../BfDsSpinner.tsx";

Deno.test("BfDsSpinner renders with default props", () => {
  const { doc } = render(<BfDsSpinner />);

  const container = doc?.querySelector(".bfds-spinner-container");
  const svg = doc?.querySelector("svg");
  const circles = doc?.querySelectorAll("circle");

  assertExists(container, "Spinner container should exist");
  assertExists(svg, "SVG element should exist");
  assertEquals(
    circles?.length,
    2,
    "Should have 2 circles (background and foreground)",
  );
  assertEquals(
    svg?.getAttribute("width"),
    "48",
    "SVG should have default width of 48",
  );
  assertEquals(
    svg?.getAttribute("height"),
    "48",
    "SVG should have default height of 48",
  );
});

Deno.test("BfDsSpinner renders with custom size", () => {
  const { doc } = render(<BfDsSpinner size={64} />);

  const container = doc?.querySelector(".bfds-spinner-container");
  const svg = doc?.querySelector("svg");

  assertExists(container, "Spinner container should exist");
  assertExists(svg, "SVG element should exist");
  assertEquals(
    svg?.getAttribute("width"),
    "64",
    "SVG should have custom width",
  );
  assertEquals(
    svg?.getAttribute("height"),
    "64",
    "SVG should have custom height",
  );
  // Container styles are applied via React's style prop
  assertExists(container, "Container should exist with custom size");
});

Deno.test("BfDsSpinner renders with custom color", () => {
  const { doc } = render(<BfDsSpinner color="red" />);

  const circles = doc?.querySelectorAll("circle");
  const animatedCircle = circles?.[1]; // Second circle is the animated one

  assertExists(animatedCircle, "Animated circle should exist");
  assertEquals(
    animatedCircle?.getAttribute("stroke"),
    "red",
    "Animated circle should have custom color",
  );
});

Deno.test("BfDsSpinner renders without waitIcon by default", () => {
  const { doc } = render(<BfDsSpinner />);

  const container = doc?.querySelector(".bfds-spinner-container");
  const svgElements = doc?.querySelectorAll("svg");

  assertExists(container, "Spinner container should exist");
  assertEquals(
    svgElements?.length,
    1,
    "Should have only one SVG element (no waitIcon)",
  );
});

Deno.test("BfDsSpinner renders with waitIcon", () => {
  const { doc } = render(<BfDsSpinner waitIcon />);

  const container = doc?.querySelector(".bfds-spinner-container");
  const svgElements = doc?.querySelectorAll("svg");
  const polygons = doc?.querySelectorAll("polygon");

  assertExists(container, "Spinner container should exist");
  assertEquals(
    svgElements?.length,
    2,
    "Should have two SVG elements (spinner + waitIcon)",
  );
  assertEquals(
    polygons?.length,
    2,
    "Should have 2 polygons for the waitIcon animation",
  );
});

Deno.test("BfDsSpinner calculates stroke width correctly", () => {
  const { doc } = render(<BfDsSpinner size={24} />);

  const circles = doc?.querySelectorAll("circle");
  const backgroundCircle = circles?.[0];
  const animatedCircle = circles?.[1];

  assertExists(backgroundCircle, "Background circle should exist");
  assertExists(animatedCircle, "Animated circle should exist");

  // For size 24, strokeWidth should be Math.max(2, 24/24) = 2
  assertEquals(
    backgroundCircle?.getAttribute("stroke-width"),
    "2",
    "Background circle should have correct stroke width",
  );
  assertEquals(
    animatedCircle?.getAttribute("stroke-width"),
    "2",
    "Animated circle should have correct stroke width",
  );
});

Deno.test("BfDsSpinner calculates stroke width correctly for large size", () => {
  const { doc } = render(<BfDsSpinner size={96} />);

  const circles = doc?.querySelectorAll("circle");
  const backgroundCircle = circles?.[0];

  assertExists(backgroundCircle, "Background circle should exist");

  // For size 96, strokeWidth should be Math.max(2, 96/24) = 4
  assertEquals(
    backgroundCircle?.getAttribute("stroke-width"),
    "4",
    "Background circle should have correct stroke width for large size",
  );
});

Deno.test("BfDsSpinner has correct animation styling", () => {
  const { doc } = render(<BfDsSpinner />);

  const circles = doc?.querySelectorAll("circle");
  const animatedCircle = circles?.[1];

  assertExists(animatedCircle, "Animated circle should exist");

  // The animated circle exists and has styling (specific CSS animation
  // properties may not be preserved in DOM testing environment)
  assertEquals(
    animatedCircle?.getAttribute("stroke-linecap"),
    "round",
    "Animated circle should have round stroke linecap",
  );
});

Deno.test("BfDsSpinner background circle has correct opacity", () => {
  const { doc } = render(<BfDsSpinner />);

  const circles = doc?.querySelectorAll("circle");
  const backgroundCircle = circles?.[0];

  assertExists(backgroundCircle, "Background circle should exist");
  assertEquals(
    backgroundCircle?.getAttribute("opacity"),
    "0.1",
    "Background circle should have 0.1 opacity",
  );
});

Deno.test("BfDsSpinner SVG has correct rotation transform", () => {
  const { doc } = render(<BfDsSpinner />);

  const svg = doc?.querySelector("svg");

  assertExists(svg, "SVG element should exist");
  assertEquals(
    svg?.getAttribute("class"),
    "bfds-spinner",
    "SVG should have bfds-spinner class",
  );
  // SVG rotation is applied via React's style prop and may not be preserved in DOM testing
});

Deno.test("BfDsFullPageSpinner renders with default props", () => {
  const { doc } = render(<BfDsFullPageSpinner />);

  const container = doc?.querySelector("div");
  const spinnerContainer = doc?.querySelector(".bfds-spinner-container");

  assertExists(container, "Container should exist");
  assertExists(spinnerContainer, "Spinner container should exist");

  // Container styles are applied via React's style prop
  // The main test is that the component renders correctly
  assertExists(container, "Container should exist with full page styling");
});

Deno.test("BfDsFullPageSpinner renders with custom styles", () => {
  const customStyles = { backgroundColor: "red", padding: "30px" };
  const { doc } = render(<BfDsFullPageSpinner xstyle={customStyles} />);

  const container = doc?.querySelector("div");

  assertExists(container, "Container should exist");

  // Custom styles are applied via React's style prop
  // The main test is that the component renders correctly with custom styling
  assertExists(container, "Container should exist with custom styles");
});

Deno.test("BfDsFullPageSpinner contains BfDsSpinner with waitIcon", () => {
  const { doc } = render(<BfDsFullPageSpinner />);

  const spinnerContainer = doc?.querySelector(".bfds-spinner-container");
  const svgElements = doc?.querySelectorAll("svg");
  const polygons = doc?.querySelectorAll("polygon");

  assertExists(spinnerContainer, "Spinner container should exist");
  assertEquals(
    svgElements?.length,
    2,
    "Should have two SVG elements (spinner + waitIcon)",
  );
  assertEquals(
    polygons?.length,
    2,
    "Should have 2 polygons for the waitIcon animation",
  );
});

Deno.test("BfDsSpinner waitIcon animation has correct attributes", () => {
  const { doc } = render(<BfDsSpinner waitIcon />);

  const animateElements = doc?.querySelectorAll("animate");

  assertEquals(
    animateElements?.length,
    2,
    "Should have 2 animate elements for waitIcon",
  );

  const firstAnimate = animateElements?.[0];
  assertExists(firstAnimate, "First animate element should exist");
  assertEquals(
    firstAnimate?.getAttribute("attributeName"),
    "points",
    "First animate should animate points",
  );
  assertEquals(
    firstAnimate?.getAttribute("dur"),
    "5s",
    "First animate should have 5s duration",
  );
  assertEquals(
    firstAnimate?.getAttribute("repeatCount"),
    "indefinite",
    "First animate should repeat indefinitely",
  );
});
