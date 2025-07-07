import type { Page } from "puppeteer-core";
import type { CursorGlobals } from "./cursor-types.ts";

export async function injectCursorOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Create cursor element
    const cursor = document.createElement("div");
    cursor.id = "e2e-cursor-overlay";
    cursor.style.cssText = `
      position: fixed;
      width: 24px;
      height: 24px;
      background: rgba(255, 50, 50, 0.9);
      border: 3px solid rgba(255, 255, 255, 1);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      transition: all 0.15s ease-out;
      box-shadow: 0 0 15px rgba(255, 50, 50, 0.8), 0 0 30px rgba(255, 50, 50, 0.4);
      transform: translate(-50%, -50%);
      display: none;
    `;

    document.body.appendChild(cursor);

    // Store cursor element globally
    (globalThis as CursorGlobals).__e2eCursor = cursor;

    // Initialize cursor in center of viewport
    const centerX = globalThis.innerWidth / 2;
    const centerY = globalThis.innerHeight / 2;
    cursor.style.left = centerX + "px";
    cursor.style.top = centerY + "px";
    cursor.style.display = "block";

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateCursorPosition();
    });

    function updateCursorPosition() {
      const cursor = (globalThis as CursorGlobals).__e2eCursor;
      if (cursor) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
        cursor.style.display = "block";
      }
    }

    // Store current mouse position globally
    (globalThis as CursorGlobals).__mousePosition = { x: mouseX, y: mouseY };
  });
}

export async function showCursor(page: Page): Promise<void> {
  await page.evaluate(() => {
    const cursor = (globalThis as CursorGlobals).__e2eCursor;
    if (cursor) {
      cursor.style.display = "block";
    }
  });
}

export async function hideCursor(page: Page): Promise<void> {
  await page.evaluate(() => {
    const cursor = (globalThis as CursorGlobals).__e2eCursor;
    if (cursor) {
      cursor.style.display = "none";
    }
  });
}

export async function updateCursorPosition(
  page: Page,
  x: number,
  y: number,
): Promise<void> {
  await page.evaluate((coords) => {
    const cursor = (globalThis as CursorGlobals).__e2eCursor;
    if (cursor) {
      cursor.style.left = coords.x + "px";
      cursor.style.top = coords.y + "px";
      cursor.style.display = "block";
    }
    // Update global mouse position
    (globalThis as CursorGlobals).__mousePosition = {
      x: coords.x,
      y: coords.y,
    };
  }, { x, y });
}

export async function setCursorStyle(
  page: Page,
  style: "default" | "click" | "hover",
): Promise<void> {
  await page.evaluate((cursorStyle) => {
    const cursor = (globalThis as CursorGlobals).__e2eCursor;
    if (!cursor) return;

    switch (cursorStyle) {
      case "click":
        cursor.style.background = "rgba(0, 255, 0, 0.9)";
        cursor.style.transform = "translate(-50%, -50%) scale(1.3)";
        cursor.style.boxShadow = "0 0 15px rgba(0, 255, 0, 0.7)";
        break;
      case "hover":
        cursor.style.background = "rgba(255, 165, 0, 0.8)";
        cursor.style.transform = "translate(-50%, -50%) scale(1.1)";
        cursor.style.boxShadow = "0 0 12px rgba(255, 165, 0, 0.6)";
        break;
      default:
        cursor.style.background = "rgba(255, 0, 0, 0.8)";
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.5)";
        break;
    }
  }, style);
}

export async function removeCursorOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    const cursor = document.getElementById("e2e-cursor-overlay");
    if (cursor) {
      cursor.remove();
    }
    delete (globalThis as CursorGlobals).__e2eCursor;
    delete (globalThis as CursorGlobals).__mousePosition;
  });
}
