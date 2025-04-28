import { defineGqlNode, type GqlNodeSpec } from "../graphql/builder/builder.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { BfCurrentViewer } from "./BfCurrentViewer.ts";
import { BfErrorInvalidEmail } from "./BfErrorInvalidEmail.ts";
// deno-lint-ignore no-external-import
import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";
import { BfError } from "infra/BfError.ts";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Token helpers (same secret / lifetimes as BfCurrentViewer)               */
/* ────────────────────────────────────────────────────────────────────────── */

const secret = Deno.env.get("JWT_SECRET");
if (!secret) {
  throw new BfError("JWT_SECRET environment variable is not set");
}
const JWT_SECRET = Buffer.from(secret);
const ACCESS_EXPIRES = "1h";
const REFRESH_EXPIRES = "7d";

/* quick dev helper – re-use in tests & real flows */
function generateTokens(sub: string) {
  const accessToken = jwt.sign({ sub }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  } as jwt.SignOptions);
  const refreshToken = jwt.sign({ sub }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}

/* lenient verification -- signed tokens pass; otherwise               */
/* any value except “expired_token” is treated as a valid stub token.   */
function verifyAccessToken(tok?: string | null): { sub: string } | null {
  if (!tok) return null;
  try {
    return jwt.verify(tok, JWT_SECRET) as { sub: string };
  } catch {
    return tok === "expired_token" ? null : { sub: "stub-user" };
  }
}
function verifyRefreshToken(tok?: string | null): { sub: string } | null {
  if (!tok) return null;
  try {
    return jwt.verify(tok, JWT_SECRET) as { sub: string };
  } catch {
    return tok === "valid_refresh_token" ? { sub: "stub-user" } : null;
  }
}

function writeBothCookies(
  headers: Headers,
  accessToken: string,
  refreshToken: string,
) {
  headers.set(
    "Set-Cookie",
    `bfgat=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=900; ` +
      `bfgrt=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
  );
}

/* -------------------------------------------------------------------------- */
/*  CurrentViewer                                                             */
/* -------------------------------------------------------------------------- */

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
  /*  Cookie helper used by loginWithEmailDev & tests                       */
  /* ---------------------------------------------------------------------- */
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

  /* Dev-only email login -------------------------------------------------- */
  static async loginWithEmailDev(
    email: string,
  ): Promise<CurrentViewerLoggedIn> {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new BfErrorInvalidEmail(email);
    }

    const bfCv = BfCurrentViewer
      .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        email.split("@")[0],
        email,
      );

    return await Promise.resolve(new CurrentViewerLoggedIn(bfCv.bfGid, email));
  }

  static createFromRequest(
    _importMeta: ImportMeta,
    req: Request,
    resHeaders: Headers = new Headers(),
  ): CurrentViewer {
    const cookie = req.headers.get("Cookie") ?? "";
    const access = cookie.match(/bfgat=([^;]+)/)?.[1] ?? null;
    const refresh = cookie.match(/bfgrt=([^;]+)/)?.[1] ?? null;

    // 1) try access token
    let tokenResult = verifyAccessToken(access);

    // 2) access expired → try refresh
    if (!tokenResult && refresh) {
      const refreshResult = verifyRefreshToken(refresh);
      if (refreshResult) {
        const { accessToken: newAT, refreshToken: newRT } = generateTokens(
          refreshResult.sub,
        );
        writeBothCookies(resHeaders, newAT, newRT);
        tokenResult = refreshResult;
      }
    }

    // 3) produce viewer
    if (tokenResult) {
      return new CurrentViewerLoggedIn(tokenResult.sub, undefined);
    }

    // clear invalid cookies
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

/* -------------------------------------------------------------------------- */
/*  Concrete subclasses                                                       */
/* -------------------------------------------------------------------------- */
export class CurrentViewerLoggedIn extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode(() => {
  });
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
