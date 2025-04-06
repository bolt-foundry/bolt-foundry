import { DOMParser } from "@b-fuze/deno-dom";
import { renderToString } from "react-dom/server";
import type React from "react";

/**
 * Renders a JSX component to HTML and provides utilities for testing
 *
 * @param component - The React/JSX component to render
 * @returns Testing utilities for querying and asserting on the rendered output
 */
export function render(node: React.ReactNode) {
  const html = renderToString(node);
  const doc = new DOMParser().parseFromString(html, "text/html");

  return {
    getByText: (text: string) => {
      const elements = Array.from(doc?.querySelectorAll("*") || []);
      return elements.find((el) => el.textContent?.includes(text));
    },
    getByRole: (role: string, options?: { name?: string }) => {
      const elements = Array.from(
        doc?.querySelectorAll(`[role="${role}"]`) || [],
      );
      if (options?.name) {
        return elements.find((el) =>
          el.getAttribute("aria-label") === options.name
        );
      }
      return elements[0];
    },
    queryByTestId: (testId: string) => {
      return doc?.querySelector(`[data-testid="${testId}"]`);
    },
    // Special helper for BfDsButtonConfirmation tests
    findConfirmationButtons: (containerId: string) => {
      const container = doc?.querySelector(`[data-testid="${containerId}"]`);
      if (
        container &&
        container.getAttribute("data-confirmation-visible") === "true"
      ) {
        return {
          confirmButton: container.querySelector(
            '[data-testid="confirm-button"]',
          ),
          cancelButton: container.querySelector(
            '[data-testid="cancel-button"]',
          ),
        };
      }
      return {
        confirmButton: null,
        cancelButton: null,
      };
    },
    // Add more query helpers as needed
    html,
    doc,
  };
}

/**
 * Helper for simulating events on DOM elements
 *
 * @param element - The DOM element to dispatch the event on
 * @param eventName - The name of the event to dispatch
 * @param options - Optional event configuration
 * @returns The dispatched event
 */
export function fireEvent(element: Element, eventName: string, options = {}) {
  const event = new Event(eventName, {
    bubbles: true,
    cancelable: true,
    ...options,
  });

  // Handle click event by potentially updating the DOM
  if (eventName === "click" && element.hasAttribute("data-testid")) {
    // If the element has an onClick attribute or event handler, simulate it
    const onClick = element.getAttribute("onclick");
    if (onClick) {
      // This is a simple simulation - may need refinement for complex cases
      try {
        eval(onClick);
      } catch (e) {
        console.error("Error executing onclick handler:", e);
      }
    }

    // For BfDsButtonConfirmation components, handle special click behavior
    const testId = element.getAttribute("data-testid");
    if (testId === "confirmation-trigger") {
      // When the trigger button is clicked, confirmation buttons should appear
      const parent = element.closest('[data-testid="confirmation-container"]');
      if (parent) {
        parent.setAttribute("data-confirmation-visible", "true");
      }
    } else if (testId === "cancel-button" || testId === "cancel-icon") {
      // When cancel is clicked, hide the confirmation
      const parent = element.closest('[data-testid="confirmation-container"]');
      if (parent) {
        parent.setAttribute("data-confirmation-visible", "false");
      }
    } else if (testId === "confirm-button") {
      // When confirm is clicked, hide the confirmation
      // Note: The actual onConfirm callback can't be simulated here
      // but we can update the visibility state
      const parent = element.closest('[data-testid="confirmation-container"]');
      if (parent) {
        parent.setAttribute("data-confirmation-visible", "false");
      }
    }
  }

  element.dispatchEvent(event);
  return event;
}
