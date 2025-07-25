import { assertEquals } from "@std/assert";
import { renderToString } from "react-dom/server";
import { BfDsToastContainer } from "../BfDsToast.tsx";

Deno.test("BfDsToastContainer - renders null when toast-root doesn't exist", () => {
  // In SSR context, document is undefined, so toast-root won't exist
  const result = renderToString(
    <BfDsToastContainer toasts={[]} onRemove={() => {}} />,
  );

  assertEquals(result, "");
});

Deno.test("BfDsToastContainer - verifies toast-root element requirement", () => {
  // This test documents that BfDsToastContainer requires a toast-root element
  // The component checks for document.getElementById("toast-root")
  // and returns null if it doesn't exist

  // In a browser environment, you would need:
  // <div id="toast-root"></div>
  // somewhere in your HTML for toasts to render

  const mockToast = {
    id: "test-toast",
    message: "Test message",
    variant: "info" as const,
  };

  // Without toast-root, component returns null
  const result = renderToString(
    <BfDsToastContainer toasts={[mockToast]} onRemove={() => {}} />,
  );

  assertEquals(result, "");
});
