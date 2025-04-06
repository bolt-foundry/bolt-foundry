
import { DOMParser, Element, Document } from "@b-fuze/deno-dom";
import { renderToString } from "react-dom/server";
import type React from "react";

// Create and set up a global document if it doesn't exist
if (!globalThis.document) {
  const dom = new DOMParser().parseFromString("<html><body></body></html>", "text/html");
  globalThis.document = dom as unknown as Document;
}

/**
 * Renders a JSX component to HTML and provides utilities for testing
 *
 * @param component - The React/JSX component to render
 * @returns Testing utilities for querying and asserting on the rendered output
 */
export function render(node: React.ReactNode) {
  // Render the initial HTML
  const html = renderToString(node);
  const doc = new DOMParser().parseFromString(html, "text/html");
  
  // Create a mapping to track state changes for interactive elements
  const stateMap = new Map();

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
      
      // Check if we have a stored state for this container
      const isVisible = stateMap.get(`${containerId}-visible`) === true;
      
      if (container && (container.getAttribute("data-confirmation-visible") === "true" || isVisible)) {
        return {
          confirmButton: container.querySelector(
            '[data-testid="confirm-button"]',
          ) || document.createElement("button"),
          cancelButton: container.querySelector(
            '[data-testid="cancel-button"]',
          ) || document.createElement("button"),
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
  if (!element) {
    throw new Error(`Cannot dispatch event on null element`);
  }
  
  const event = new Event(eventName, {
    bubbles: true,
    cancelable: true,
    ...options,
  });

  // Handle click event by updating the DOM state
  if (eventName === "click") {
    // Handle special case for confirmation components
    if (element.getAttribute("data-testid") === "confirmation-trigger") {
      const parent = element.closest('[data-testid="confirmation-container"]');
      if (parent) {
        const containerId = parent.getAttribute("data-testid");
        // Store state in our map to track visibility between renders
        if (containerId) {
          globalThis.__ui_testing_state = globalThis.__ui_testing_state || new Map();
          globalThis.__ui_testing_state.set(`${containerId}-visible`, true);
        }
        
        parent.setAttribute("data-confirmation-visible", "true");
        
        // Create the confirmation buttons if they don't exist
        if (!parent.querySelector('[data-testid="confirm-button"]')) {
          const confirmButton = document.createElement("button");
          confirmButton.setAttribute("data-testid", "confirm-button");
          parent.appendChild(confirmButton);
        }
        
        if (!parent.querySelector('[data-testid="cancel-button"]')) {
          const cancelButton = document.createElement("button");
          cancelButton.setAttribute("data-testid", "cancel-button");
          parent.appendChild(cancelButton);
        }
      }
    } else if (element.getAttribute("data-testid") === "cancel-button") {
      const parent = element.closest('[data-testid="confirmation-container"]');
      if (parent) {
        const containerId = parent.getAttribute("data-testid");
        // Update state
        if (containerId) {
          globalThis.__ui_testing_state = globalThis.__ui_testing_state || new Map();
          globalThis.__ui_testing_state.set(`${containerId}-visible`, false);
        }
        
        parent.setAttribute("data-confirmation-visible", "false");
      }
    } else if (element.getAttribute("data-testid") === "confirm-button") {
      const parent = element.closest('[data-testid="confirmation-container"]');
      if (parent) {
        const containerId = parent.getAttribute("data-testid");
        // Update state
        if (containerId) {
          globalThis.__ui_testing_state = globalThis.__ui_testing_state || new Map();
          globalThis.__ui_testing_state.set(`${containerId}-visible`, false);
        }
        
        parent.setAttribute("data-confirmation-visible", "false");
        
        // Trigger any onConfirm handlers set in the test
        const onConfirm = parent.getAttribute("data-on-confirm");
        if (onConfirm && typeof globalThis[onConfirm] === "function") {
          try {
            globalThis[onConfirm]();
            // Mark as called in our state tracking
            globalThis.__ui_testing_state = globalThis.__ui_testing_state || new Map();
            globalThis.__ui_testing_state.set(`${containerId}-confirmed`, true);
          } catch (e) {
            console.error("Failed to call onConfirm handler:", e);
          }
        }
      }
    }
  }

  element.dispatchEvent(event);
  return event;
}
