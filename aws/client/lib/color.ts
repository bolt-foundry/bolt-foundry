export function hexToRgb(hex: string) {
  // Remove the hash at the front if it's there
  hex = hex.replace(/^#/, "");

  // Parse the hex color string into integer values for red, green, and blue
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Check for any parsing errors
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error("Invalid HEX color code");
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbToHex(rgb: string) {
  // Parse the string into its red, green, and blue integer values
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  if (!match) {
    throw new Error("Invalid RGB color string");
  }

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  // Check for any parsing errors
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error("Invalid RGB color string");
  }

  // Convert the integer values into a single hex color string
  return `#${r.toString(16).padStart(2, "0")}${
    g.toString(16).padStart(2, "0")
  }${b.toString(16).padStart(2, "0")}`;
}
