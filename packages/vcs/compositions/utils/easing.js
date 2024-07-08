export function easeInOutCubic(t) {
  if (t < 0.5) {
    // Ease in
    return 4 * t * t * t;
  } else {
    // Ease out
    const p = -2 * t + 2;
    return 1 - Math.pow(p, 3) / 2;
  }
}

export function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
