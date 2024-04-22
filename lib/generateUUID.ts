export function generateUUID(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant 1

  const byteToHex = (byte: { toString: (arg0: number) => string }) =>
    byte.toString(16).padStart(2, "0");

  return [
    ...Array.from(randomBytes.slice(0, 4), byteToHex),
    ...Array.from(randomBytes.slice(4, 6), byteToHex),
    ...Array.from(randomBytes.slice(6, 8), byteToHex),
    ...Array.from(randomBytes.slice(8, 10), byteToHex),
    ...Array.from(randomBytes.slice(10), byteToHex),
  ].join("");
}
