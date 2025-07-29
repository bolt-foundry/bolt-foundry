import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsModal } from "../BfDsModal.tsx";

Deno.test("BfDsModal renders children when open", () => {
  const { getByText } = render(
    <BfDsModal isOpen onClose={() => {}}>
      <div>Modal content</div>
    </BfDsModal>,
  );

  assertExists(getByText("Modal content"));
});

Deno.test("BfDsModal does not render when closed", () => {
  const { doc } = render(
    <BfDsModal isOpen={false} onClose={() => {}}>
      <div>Modal content</div>
    </BfDsModal>,
  );

  const modal = doc?.querySelector(".bfds-modal");
  assertEquals(modal, null);
});

Deno.test("BfDsModal renders title when provided", () => {
  const { getByText } = render(
    <BfDsModal isOpen onClose={() => {}} title="Test Modal">
      <div>Content</div>
    </BfDsModal>,
  );

  assertExists(getByText("Test Modal"));
});

Deno.test("BfDsModal renders footer when provided", () => {
  const { getByText } = render(
    <BfDsModal
      isOpen
      onClose={() => {}}
      footer={<div>Footer content</div>}
    >
      <div>Content</div>
    </BfDsModal>,
  );

  assertExists(getByText("Footer content"));
});

Deno.test("BfDsModal applies size classes correctly", () => {
  const sizes = ["small", "medium", "large", "fullscreen"] as const;

  sizes.forEach((size) => {
    const { doc } = render(
      <BfDsModal isOpen onClose={() => {}} size={size}>
        <div>Content</div>
      </BfDsModal>,
    );

    const modal = doc?.querySelector(".bfds-modal");
    assertExists(modal);
    assertEquals(modal.classList.contains(`bfds-modal--${size}`), true);
  });
});

Deno.test("BfDsModal renders close button by default", () => {
  const { doc } = render(
    <BfDsModal isOpen onClose={() => {}}>
      <div>Content</div>
    </BfDsModal>,
  );

  const closeButton = doc?.querySelector(".bfds-modal-close");
  assertExists(closeButton);
});

Deno.test("BfDsModal hides close button when showCloseButton is false", () => {
  const { doc } = render(
    <BfDsModal isOpen onClose={() => {}} showCloseButton={false}>
      <div>Content</div>
    </BfDsModal>,
  );

  const closeButton = doc?.querySelector(".bfds-modal-close");
  assertEquals(closeButton, null);
});

Deno.test("BfDsModal applies custom className", () => {
  const { doc } = render(
    <BfDsModal isOpen onClose={() => {}} className="custom-modal">
      <div>Content</div>
    </BfDsModal>,
  );

  const modal = doc?.querySelector(".bfds-modal");
  assertExists(modal);
  assertEquals(modal.classList.contains("custom-modal"), true);
});

Deno.test("BfDsModal renders complete modal with all sections", () => {
  const { getByText, doc } = render(
    <BfDsModal
      isOpen
      onClose={() => {}}
      title="Complete Modal"
      footer={<div>Footer</div>}
      size="large"
      className="test-modal"
    >
      <div>Main content</div>
    </BfDsModal>,
  );

  assertExists(getByText("Complete Modal"));
  assertExists(getByText("Main content"));
  assertExists(getByText("Footer"));

  const modal = doc?.querySelector(".bfds-modal");
  assertExists(modal);
  assertEquals(modal.classList.contains("bfds-modal--large"), true);
  assertEquals(modal.classList.contains("test-modal"), true);

  const header = doc?.querySelector(".bfds-modal-header");
  const body = doc?.querySelector(".bfds-modal-body");
  const footer = doc?.querySelector(".bfds-modal-footer");

  assertExists(header);
  assertExists(body);
  assertExists(footer);
});
