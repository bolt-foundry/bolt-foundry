import { getSecret } from "@bolt-foundry/get-configuration-var";
import { decodeBase64Url, encodeBase64Url } from "@std/encoding/base64url";
import type { BfGid } from "@bfmono/lib/types.ts";

/* ------------------------------------------------------------------------- */
/*  Types                                                                    */
/* ------------------------------------------------------------------------- */

export type SessionType = "access" | "refresh";

export interface BaseSessionClaims {
  /** access | refresh */
  typ: SessionType;
  /** Person node GID */
  personGid: string;
  /** Org node OID */
  orgOid: string;
  /** optional refresh‑token version */
  ver?: number;
  /** JWT expiry (seconds since epoch, *optional*) */
  exp?: number;
}

export interface ViewerClaims {
  personGid: string;
  orgOid: string;
  tokenVersion: number;
}

/* ------------------------------------------------------------------------- */
/*  Constants                                                                */
/* ------------------------------------------------------------------------- */

export const ACCESS_COOKIE = "bf_access";
export const REFRESH_COOKIE = "bf_refresh";

/* ------------------------------------------------------------------------- */
/*  Internals                                                                */
/* ------------------------------------------------------------------------- */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/** Parse simple duration strings: "15m", "30d", "10h", "45s" → seconds. */
function toSeconds(dur: string | number): number {
  if (typeof dur === "number") return dur;
  const match = /^(\d+)([smhd])$/.exec(dur.trim());
  if (!match) throw new Error(`Invalid expiresIn: ${dur}`);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 24 * 60 * 60;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}

/** Pull shared secret from env & normalise → CryptoKey */
async function getKey(): Promise<CryptoKey> {
  const secret = getSecret("JWT_SECRET");
  if (!secret) throw new Error("JWT_SECRET env var not set");
  return await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** base64url(JSON(data)) */
function toB64Url(obj: unknown): string {
  return encodeBase64Url(textEncoder.encode(JSON.stringify(obj)));
}

function fromB64Url<T>(b64url: string): T {
  const bytes = decodeBase64Url(b64url);
  return JSON.parse(textDecoder.decode(bytes)) as T;
}

/* ------------------------------------------------------------------------- */
/*  Public – JWT primitives                                                  */
/* ------------------------------------------------------------------------- */

interface SignOpts {
  /** expiresIn – e.g. "15m", "30d", 3600 */
  expiresIn?: string | number;
}

/**
 * signSession – compact HS256 JWT `header.payload.signature`.
 * Attaches `exp` when `expiresIn` provided.
 */
export async function signSession(
  payload: Omit<BaseSessionClaims, "exp">,
  opts: SignOpts = {},
): Promise<string> {
  const header = toB64Url({ alg: "HS256", typ: "JWT" });

  let bodyObj: BaseSessionClaims = { ...payload } as BaseSessionClaims;
  if (opts.expiresIn !== undefined) {
    const expSec = toSeconds(opts.expiresIn);
    bodyObj = { ...bodyObj, exp: Math.floor(Date.now() / 1000) + expSec };
  }
  const body = toB64Url(bodyObj);

  const data = `${header}.${body}`;
  const key = await getKey();
  const sigBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(data),
  );
  const sig = encodeBase64Url(new Uint8Array(sigBytes));
  return `${data}.${sig}`;
}

/**
 * verifySession – validates signature (and `exp` when present).
 * Returns claims on success, otherwise `null`.
 */
export async function verifySession(
  token: string,
): Promise<BaseSessionClaims | null> {
  const [h, b, s] = token.split(".");
  if (!h || !b || !s) return null;

  const key = await getKey();
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    decodeBase64Url(s),
    textEncoder.encode(`${h}.${b}`),
  );
  if (!ok) return null;

  try {
    const payload = fromB64Url<BaseSessionClaims>(b);
    if (payload.exp && payload.exp < Date.now() / 1000) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

/**
 * buildCookie – serialises cookie with sensible defaults.  Pass `maxAge` in
 * **seconds** (aligns with JWT `expiresIn`).
 */
export function buildCookie(
  name: string,
  token: string,
  maxAge: number,
): string {
  return [
    `${name}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ].join("; ");
}

/* ------------------------------------------------------------------------- */
/*  Public – Higher‑level helpers                                            */
/* ------------------------------------------------------------------------- */

/**
 * buildAuthCookies – produce pre‑baked `Set‑Cookie` strings for ACCESS + REFRESH.
 */
export async function buildAuthCookies(
  personGid: string,
  orgOid: string,
  tokenVersion = 1,
): Promise<{ access: string; refresh: string }> {
  const accessJwt = await signSession(
    { typ: "access", personGid, orgOid },
    { expiresIn: "15m" },
  );

  const refreshJwt = await signSession(
    { typ: "refresh", personGid, orgOid, ver: tokenVersion },
    { expiresIn: "30d" },
  );

  return {
    access: buildCookie(ACCESS_COOKIE, accessJwt, 15 * 60),
    refresh: buildCookie(REFRESH_COOKIE, refreshJwt, 30 * 24 * 60 * 60),
  };
}

/**
 * claimsFromRequest – extract viewer claims from cookies.  If ACCESS is
 * missing/expired but REFRESH is valid, it issues a fresh ACCESS cookie via
 * `resHeaders` (if provided) and returns the claims.
 */
export async function claimsFromRequest(
  req: Request,
  resHeaders?: Headers,
): Promise<ViewerClaims | null> {
  const cookies = req.headers.get("cookie") ?? "";

  // 1️⃣  ACCESS cookie first (fast‑path)
  const accessMatch = new RegExp(`${ACCESS_COOKIE}=([^;]+)`).exec(cookies);
  if (accessMatch) {
    const payload = await verifySession(accessMatch[1]);
    if (payload && payload.typ === "access") {
      return {
        personGid: payload.personGid,
        orgOid: payload.orgOid,
        tokenVersion: payload.ver ?? 1,
      };
    }
  }

  // 2️⃣  REFRESH cookie fallback
  const refreshMatch = new RegExp(`${REFRESH_COOKIE}=([^;]+)`).exec(cookies);
  if (refreshMatch) {
    const payload = await verifySession(refreshMatch[1]);
    if (payload && payload.typ === "refresh") {
      // roll new ACCESS token
      if (resHeaders) {
        const newAccessJwt = await signSession(
          {
            typ: "access",
            personGid: payload.personGid,
            orgOid: payload.orgOid,
          },
          { expiresIn: "15m" },
        );
        resHeaders.append(
          "Set-Cookie",
          buildCookie(ACCESS_COOKIE, newAccessJwt, 15 * 60),
        );
      }
      return {
        personGid: payload.personGid,
        orgOid: payload.orgOid,
        tokenVersion: payload.ver ?? 1,
      };
    }

    // invalid refresh → clear it to avoid repeated work
    if (resHeaders) {
      resHeaders.append(
        "Set-Cookie",
        `${REFRESH_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      );
    }
  }

  return null; // anonymous
}

/* ---------------------------------------------------------------------- */
/*  Cookie helpers – delegated to utils                                   */
/* ---------------------------------------------------------------------- */

export async function setLoginSuccessHeaders(
  headers: Headers,
  personBfGid: BfGid,
  orgBfOid: BfGid,
  tokenVersion = 1,
) {
  const { access, refresh } = await buildAuthCookies(
    personBfGid,
    orgBfOid,
    tokenVersion,
  );
  headers.append("Set-Cookie", access);
  headers.append("Set-Cookie", refresh);
}

export function clearAuthCookies(headers: Headers) {
  headers.append(
    "Set-Cookie",
    `${ACCESS_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );
  headers.append(
    "Set-Cookie",
    `${REFRESH_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
  );
}
