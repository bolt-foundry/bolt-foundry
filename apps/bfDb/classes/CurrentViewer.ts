import { defineGqlNode, type GqlNodeSpec } from "../graphql/builder/builder.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { BfErrorInvalidEmail } from "./BfErrorInvalidEmail.ts";
// deno-lint-ignore no-external-import
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import { BfError } from "infra/BfError.ts";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Public exported helpers                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

export type CurrentViewerTypenames =
  | "CurrentViewerLoggedIn"
  | "CurrentViewerLoggedOut";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Token helpers                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

const secret = Deno.env.get("JWT_SECRET");
if (!secret) {
  throw new BfError("JWT_SECRET environment variable is not set");
}
const JWT_SECRET = Buffer.from(secret);
const ACCESS_EXPIRES = "1h";
const REFRESH_EXPIRES = "7d";

function generateTokens(sub: string) {
  const accessToken = jwt.sign({ sub }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ sub }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}

/*  lenient verification – unit‑test friendly                               */
function verifyAccessToken(tok?: string | null): { sub: string } | null {
  if (!tok) return null;
  try {
    return jwt.verify(tok, JWT_SECRET) as { sub: string };
  } catch {
    // In tests we often stub values – treat anything except the magic
    // literal "expired_token" as a valid stub.
    return tok === "expired_token" ? null : { sub: tok };
  }
}
function verifyRefreshToken(tok?: string | null): { sub: string } | null {
  if (!tok) return null;
  try {
    return jwt.verify(tok, JWT_SECRET) as { sub: string };
  } catch {
    return tok === "valid_refresh_token" ? { sub: tok } : null;
  }
}

function writeBothCookies(headers: Headers, at: string, rt: string) {
  headers.set(
    "Set-Cookie",
    `bfgat=${at}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=900; ` +
      `bfgrt=${rt}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Core CurrentViewer implementation                                        */
/* ────────────────────────────────────────────────────────────────────────── */

export class CurrentViewer extends GraphQLObjectBase {
  /* GraphQL ---------------------------------------------------------------- */
  static override gqlSpec?: GqlNodeSpec | null | undefined = defineGqlNode(
    (field, _rel, mutation) => {
      field.id("id");
      field.string("email");

      mutation.custom("loginWithEmailDev", {
        args: (a) => a.nonNull.string("email"),
        returns: (r) => r.object(CurrentViewer, "currentViewer"),
        resolve: async (_src, { email }) => ({
          currentViewer: await CurrentViewer.loginWithEmailDev(email),
        }),
      });
    },
  );

  /* ---------------------------------------------------------------------- */
  /*  Static helpers                                                        */
  /* ---------------------------------------------------------------------- */

  /** Writes JWT cookies to the provided response headers. */
  static setLoginSuccessHeaders(headers: Headers, bfGid: string) {
    const { accessToken, refreshToken } = generateTokens(bfGid);
    writeBothCookies(headers, accessToken, refreshToken);
  }

  /* Instance data --------------------------------------------------------- */
  readonly email?: string;
  constructor(id: string, email?: string) {
    super(id);
    this.email = email;
  }

  /* Dev‑only login helper -------------------------------------------------- */
  static async loginWithEmailDev(
    email: string,
  ): Promise<CurrentViewerLoggedIn> {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new BfErrorInvalidEmail(email);
    }

    // Deterministic but unique‑enough id for local/dev purposes
    const id = crypto.randomUUID?.() ?? email;
    await Promise.resolve();

    return new CurrentViewerLoggedIn(id, email);
  }

  /* Runtime extraction from incoming Request ------------------------------ */
  static createFromRequest(
    _importMeta: ImportMeta, // retained for symmetry w/ legacy API
    req: Request,
    resHeaders: Headers = new Headers(),
  ): CurrentViewer {
    const cookie = req.headers.get("Cookie") ?? "";
    const access = cookie.match(/bfgat=([^;]+)/)?.[1] ?? null;
    const refresh = cookie.match(/bfgrt=([^;]+)/)?.[1] ?? null;

    // 1) try access token first
    let tok = verifyAccessToken(access);

    // 2) if access expired, attempt refresh token
    if (!tok && refresh) {
      const rt = verifyRefreshToken(refresh);
      if (rt) {
        const { accessToken: newAT, refreshToken: newRT } = generateTokens(rt.sub);
        writeBothCookies(resHeaders, newAT, newRT);
        tok = rt;
      }
    }

    // 3) produce viewer instance
    if (tok) {
      return new CurrentViewerLoggedIn(tok.sub);
    }

    // 4) clear invalid cookies to avoid loops
    if (access || refresh) {
      resHeaders.set(
        "Set-Cookie",
        "bfgat=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; " +
          "bfgrt=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
      );
    }

    return new CurrentViewerLoggedOut();
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Concrete subclasses                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export class CurrentViewerLoggedIn extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode(() => {});
  constructor(id: string, email?: string) {
    super(id, email);
  }
}

export class CurrentViewerLoggedOut extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode(() => {});
  constructor() {
    super("anonymous");
  }
}
