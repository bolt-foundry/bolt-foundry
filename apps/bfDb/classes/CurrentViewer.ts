import { defineGqlNode, type GqlNodeSpec } from "../graphql/builder/builder.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { BfErrorInvalidEmail } from "./BfErrorInvalidEmail.ts";
import { type BfGid, toBfGid } from "../classes/BfNodeIds.ts";
import { claimsFromRequest } from "apps/bfDb/graphql/utils/graphqlContextUtils.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

/* -------------------------------------------------------------------------- */
/*  GraphQL typenames                                                         */
/* -------------------------------------------------------------------------- */

export type CurrentViewerTypenames =
  | "CurrentViewerLoggedIn"
  | "CurrentViewerLoggedOut";

/* -------------------------------------------------------------------------- */
/*  Core CurrentViewer model                                                  */
/* -------------------------------------------------------------------------- */

export class CurrentViewer extends GraphQLObjectBase {
  /* GraphQL -------------------------------------------------------------- */
  static override gqlSpec?: GqlNodeSpec | null | undefined = defineGqlNode(
    (field, _rel, mutation) => {
      field.id("id"); // refresh‑token version
      field.string("personBfGid");
      field.string("orgBfOid");

      mutation.custom("loginWithEmailDev", {
        args: (a) => a.nonNull.string("email"),
        returns: (r) => r.object(CurrentViewer, "currentViewer"),
        resolve: async (_src, { email }, ctx) => {
          const currentViewer = await ctx.loginWithEmailDev(email);
          return { currentViewer };
        },
      });
    },
  );

  /* Properties ----------------------------------------------------------- */
  readonly orgBfOid: BfGid;
  readonly personBfGid: BfGid;

  constructor(personBfGid: BfGid, orgBfOid: BfGid, tokenVersion = 1) {
    super(String(tokenVersion)); // expose refresh‑token version as `id`
    this.orgBfOid = orgBfOid;
    this.personBfGid = personBfGid;
  }

  /* ------------------------------------------------------------------
   *  dev‑only helpers used by tests & seed scripts
   * ------------------------------------------------------------------ */
  static __DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    _meta: ImportMeta,
    id = "dev@example.com",
    orgSlug = "dev-org",
    tokenVersion = 1,
  ): CurrentViewer {
    return new CurrentViewerLoggedIn(
      toBfGid(id),
      toBfGid(orgSlug),
      tokenVersion,
    );
  }

  /** simple e‑mail login helper (dev only) */
  // deno-lint-ignore require-await
  static async loginWithEmailDev(
    email: string,
  ): Promise<CurrentViewerLoggedIn> {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new BfErrorInvalidEmail(email);
    }
    const id = crypto.randomUUID?.() ?? email;
    return new CurrentViewerLoggedIn(
      toBfGid(`person:${id}`),
      toBfGid("dev-org"),
      1,
    );
  }

  /* ------------------------------------------------------------------
   *  HTTP→Viewer extraction – delegates to utils.claimsFromRequest
   * ------------------------------------------------------------------ */
  static async createFromRequest(
    _meta: ImportMeta,
    req: Request,
    resHeaders?: Headers,
  ): Promise<CurrentViewer> {
    // --- existing JWT-based logic ---
    try {
      const claims = await claimsFromRequest(req, resHeaders);
      if (!claims) {
        logger.debug("No valid session cookies – returning LoggedOut viewer");
        return this.makeLoggedOutCv();
      }
      logger.debug(
        `Restored viewer ${claims.personGid} (org ${claims.orgOid})`,
      );
      return this.makeLoggedInCv(
        toBfGid(claims.personGid),
        toBfGid(claims.orgOid),
        claims.tokenVersion,
      );
    } catch (err) {
      logger.warn("createFromRequest failed, falling back to LoggedOut", err);
      return this.makeLoggedOutCv();
    }
  }

  /* ------------------------------------------------------------------
   *  Factory helpers
   * ------------------------------------------------------------------ */

  /**
   * Build a fully‑populated Logged‑in viewer.
   */
  static makeLoggedInCv(
    personBfGid: BfGid,
    orgBfOid: BfGid,
    tokenVersion = 1,
  ): CurrentViewerLoggedIn {
    return new CurrentViewerLoggedIn(personBfGid, orgBfOid, tokenVersion);
  }

  /**
   * Build a Logged‑out viewer (anonymous).  Uses deterministic placeholder
   * GIDs so equality checks in tests stay stable across runs.
   */
  static makeLoggedOutCv(tokenVersion = 1): CurrentViewerLoggedOut {
    return new CurrentViewerLoggedOut(
      toBfGid("person:anonymous"),
      toBfGid("org:public"),
      tokenVersion,
    );
  }

  /* ---------------------------------------------------------------------- */
  /*  GraphQL serialisation                                                 */
  /* ---------------------------------------------------------------------- */

  toGraphql() {
    return {
      __typename: this.constructor.name as CurrentViewerTypenames,
      id: this.id,
      personBfGid: this.personBfGid,
      orgBfOid: this.orgBfOid,
    } as const;
  }
}

/* -------------------------------------------------------------------------- */
/*  Concrete subclasses                                                      */
/* -------------------------------------------------------------------------- */

export class CurrentViewerLoggedIn extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode(() => {});
}

export class CurrentViewerLoggedOut extends CurrentViewer {
  static override gqlSpec = this.defineGqlNode(() => {});
}
