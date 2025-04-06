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
  const event = new Event(eventName, { bubbles: true, ...options });
  element.dispatchEvent(event);
  return event;
}
