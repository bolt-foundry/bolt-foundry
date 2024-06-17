import { create, decode, Payload, verify } from "packages/bfDb/deps.ts";
import { BfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "deps.ts";
import { ACCOUNT_ROLE } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
const accessLogger = getLogger(import.meta);

type GooglePayload = Payload & {
  email: string;
  name: string;
  phone_number: string;
  picture: string;
  email_verified: boolean;
  sub: string;
  hd?: string;
};

const googleJwkUrl = "https://www.googleapis.com/oauth2/v3/certs";
const { keys: googleJwks } = await fetch(googleJwkUrl).then((r) => r.json());

const ACCESS_TOKEN_EXPIRATION_WINDOW_SECONDS = 300;
const cryptoKeySecret = Deno.env.get("JWT_SECRET") ?? "this is a super insecure jwt secret. you should be ashamed of yourself if you use it";

const bfCryptoKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(cryptoKeySecret),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);
const aud = "bfBff";

type BfAccessTokenPayload = {
  actorBfGid: BfGid;
  personBfGid: BfGid;
  role: ACCOUNT_ROLE;
  accountBfGid: BfGid;
};

type BfRefreshTokenPayload = BfAccessTokenPayload & {
  role: ACCOUNT_ROLE.REFRESH_CREDENTIALS_ONLY;
};

async function jwkToCryptoKey(
  jwk: { kty: string; n: string; e: string; alg: string },
) {
  const key = await globalThis.crypto.subtle.importKey(
    "jwk",
    {
      kty: jwk.kty,
      n: jwk.n,
      e: jwk.e,
      alg: jwk.alg,
      ext: true,
    },
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["verify"],
  );

  return key;
}

export class BfAuthError extends Error {}
export class JwkAuthError extends BfAuthError {}
export class JwtVerificationError extends BfAuthError {}

export async function decodeAndVerifyGoogleToken(
  token?: string,
) {
  if (!token) {
    throw new BfAuthError("ID token not found");
  }
  const jwks = [...googleJwks];
  const header = JSON.parse(atob(token.split(".")[0]));
  const jwk = jwks.find((jwk: { kid: string }) => jwk.kid === header.kid);

  if (!jwk) {
    throw new JwkAuthError("JWK for ID token not found");
  }

  const key = await jwkToCryptoKey(jwk);

  // Verify the JWT
  try {
    const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
    await verify(token, key, {
      audience: GOOGLE_OAUTH_CLIENT_ID,
    });
  } catch (e) {
    throw new JwtVerificationError(e.message);
  }

  // If the verification is successful, decode the JWT
  try {
    const [_header, payload, _signature] = decode(token);
    return payload as GooglePayload;
  } catch (e) {
    throw new JwtVerificationError(e.message);
  }
}

export type BfJwtPayload =
  & (BfAccessTokenPayload | BfRefreshTokenPayload)
  & Payload;

export function encodeBfAccessToken(
  importMeta: ImportMeta,
  payload: BfAccessTokenPayload,
): Promise<string> {
  const { actorBfGid, accountBfGid } = payload;
  const sub = actorBfGid;
  const iss = accountBfGid;

  accessLogger.info(
    `encodeBfAccessToken: sub: ${sub}, iss: ${iss} from ${importMeta.url}`,
  );
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ACCESS_TOKEN_EXPIRATION_WINDOW_SECONDS;

  return create({ alg: "HS256", typ: "JWT" }, {
    ...payload,
    sub,
    iat,
    iss,
    exp,
    aud,
  }, bfCryptoKey);
}

export async function decodeAndVerifyBfJwt(
  token: string,
): Promise<BfJwtPayload> {
  try {
    return await verify(token, bfCryptoKey, { audience: aud }) as BfJwtPayload;
  } catch (e) {
    throw new JwtVerificationError(e.message);
  }
}

// number of seconds before the expiration time to consider the token expired (30 days)
const REFRESH_TOKEN_EXPIRATION_WINDOW_SECONDS = 60 * 60 * 24 * 30;
export function encodeBfRefreshToken(
  importMeta: ImportMeta,
  payload: BfRefreshTokenPayload,
): Promise<string> {
  const { actorBfGid, accountBfGid } = payload;
  const sub = actorBfGid;
  const iss = accountBfGid;
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + REFRESH_TOKEN_EXPIRATION_WINDOW_SECONDS;

  accessLogger.info(
    `encodeBfRefreshToken: sub: ${sub}, iss: ${iss} from ${importMeta.url}`,
  );

  return create({ alg: "HS256", typ: "JWT" }, {
    ...payload,
    sub,
    iat,
    iss,
    exp,
    aud,
    role: ACCOUNT_ROLE.REFRESH_CREDENTIALS_ONLY,
  }, bfCryptoKey);
}
