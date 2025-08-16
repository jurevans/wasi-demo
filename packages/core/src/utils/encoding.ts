/**
 * Return base64-encoded bytes
 * @param bytes - Uint8Array of bytes
 * @returns string
 */
export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Return bytes from base64-encoded string
 * @param base64 - base64-encoded string
 * @returns Uint8Array
 */
export function fromBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Uint8Array(bytes.buffer);
}

/**
 * Converta hex string to a byte array
 * @param hex - string
 * @returns Uint8Array
 */
export function fromHex(hex: string): Uint8Array {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return new Uint8Array(bytes);
}

/**
 * Convert a byte array to a hex string
 * @param bytes - Uint8Array
 * @returns string
 */
export function toHex(bytes: Uint8Array): string {
  const hex = [];
  for (let i = 0; i < bytes.length; i++) {
    const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xf).toString(16));
  }
  return hex.join("");
}
