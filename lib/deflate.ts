
export const DEFLATE_VERSION = 1;

export interface DeflateContentObjectType {
  v: number;
  content: string;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  meta?: Record<string, unknown>;
}

// ── Base64url helpers (RFC 4648 §5, no padding) ─────────────

function uint8ToBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlToUint8(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ── Compression Stream helpers ──────────────────────────────

async function compressRaw(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("deflate-raw");
  const writer = cs.writable.getWriter();
  // @ts-ignore 
  writer.write(data);
  writer.close();

  const reader = cs.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLen = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLen += value.length;
  }

  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

async function decompressRaw(data: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("deflate-raw");
  const writer = ds.writable.getWriter();
  // @ts-ignore 
  writer.write(data);
  writer.close();

  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLen = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLen += value.length;
  }

  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}



const KEY_MAP: Record<string, string> = {
  v: "v",
  content: "c",
  title: "t",
  createdAt: "a",
  updatedAt: "u",
  meta: "m",
};

const KEY_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(KEY_MAP).map(([full, short]) => [short, full]),
);

function minifyKeys(obj: DeflateContentObjectType): Record<string, unknown> {
  const minified: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const shortKey = KEY_MAP[key] ?? key;
    minified[shortKey] = value;
  }
  return minified;
}

function expandKeys(
  minified: Record<string, unknown>,
): DeflateContentObjectType {
  const expanded: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(minified)) {
    const fullKey = KEY_REVERSE[key] ?? key;
    expanded[fullKey] = value;
  }
  return expanded as unknown as DeflateContentObjectType;
}

// ── Public API ──────────────────────────────────────────────

/**
 * @param obj - The content object to encode
 * @returns A short, URL-safe encoded string
 */
export async function deflateEncode(
  obj: DeflateContentObjectType,
): Promise<string> {
  const prepared: DeflateContentObjectType = {
    ...obj,
    v: obj.v ?? DEFLATE_VERSION,
  };

  const minified = minifyKeys(prepared);
  const json = JSON.stringify(minified);
  const encoded = new TextEncoder().encode(json);
  const compressed = await compressRaw(encoded);
  return uint8ToBase64url(compressed);
}

/**
 * @param encoded - The encoded string (from `deflateEncode`)
 * @returns The fully reconstructed content object (zero data loss)
 * @throws Error if the string is invalid, corrupt, or missing required fields
 */
export async function deflateDecode(
  encoded: string,
): Promise<DeflateContentObjectType> {
  if (!encoded || encoded.trim().length === 0) {
    throw new Error("deflate: cannot decode empty string");
  }

  const compressed = base64urlToUint8(encoded);
  const decompressed = await decompressRaw(compressed);
  const json = new TextDecoder().decode(decompressed);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("deflate: corrupted data — JSON parse failed");
  }

  const obj = expandKeys(parsed);

  if (typeof obj.content !== "string") {
    throw new Error("deflate: decoded object missing required 'content' field");
  }

  return obj;
}

export async function deflateTryDecode(
  encoded: string | undefined | null,
): Promise<DeflateContentObjectType | null> {
  if (!encoded) return null;
  try {
    return await deflateDecode(encoded);
  } catch {
    return null;
  }
}

export function createDeflateContent(
  content: string,
  options?: Partial<Omit<DeflateContentObjectType, "v" | "content">>,
): DeflateContentObjectType {
  return {
    v: DEFLATE_VERSION,
    content,
    createdAt: Date.now(),
    ...options,
  };
}
