/* -------------------------------------------------------------------------- */
/*  CurrentViewer – Phase‑0 stub (updated)                                    */
/*  Location: apps/bfDb/classes/CurrentViewer.ts                              */
/*                                                                            */
/*  Uses explicit subclasses (LoggedIn / LoggedOut) instead of passing        */
/*  state flags into the base constructor.                                    */
/* -------------------------------------------------------------------------- */

import { defineGqlNode } from "../graphql/builder/builder.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import { BfCurrentViewer } from "./BfCurrentViewer.ts";
import { BfErrorInvalidEmail } from "./BfErrorInvalidEmail.ts";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Simple RFC‑5322‑ish e‑mail matcher – good enough for dev stubs. */
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* -------------------------------------------------------------------------- */
/*  Base class                                                                 */
/* -------------------------------------------------------------------------- */

export class CurrentViewer extends GraphQLObjectBase {
  /* ------------------------------------------------------------------------ */
  /*  GraphQL spec (builder DSL)                                              */
  /* ------------------------------------------------------------------------ */
  static override gqlSpec = defineGqlNode((field, _rel, mutation) => {
    field.id("id");
    field.string("email");

    /* ── Dev‑only email login ───────────────────────────────────────────── */
    mutation.custom("loginWithEmailDev", {
      args: (a) => a.nonNull.string("email"),
      returns: (r) => r.object(CurrentViewer, "currentViewer"),
      resolve: async (_src, { email }) => ({
        currentViewer: await CurrentViewer.loginWithEmailDev(email),
      }),
    });
  });

  /* ------------------------------------------------------------------------ */
  /*  Instance fields                                                         */
  /* ------------------------------------------------------------------------ */
  readonly email?: string;

  constructor(id: string, email?: string) {
    super(id);
    this.email = email;
  }

  /* ------------------------------------------------------------------------ */
  /*  Dev‑only e‑mail login helper                                            */
  /* ------------------------------------------------------------------------ */
  // deno-lint-ignore require-await
  static async loginWithEmailDev(
    email: string,
  ): Promise<CurrentViewerLoggedIn> {
    if (!EMAIL_REGEX.test(email)) {
      throw new BfErrorInvalidEmail(email);
    }

    // Re‑use the existing BfCurrentViewer logic so we don't duplicate
    // token / storage behaviour during the migration.
    const bfCv = BfCurrentViewer
      .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        email.split("@")[0], // temporary display name
        email,
      );

    return new CurrentViewerLoggedIn(bfCv.bfGid, email);
  }

  /* ------------------------------------------------------------------------ */
  /*  Request‑scoped helper – anonymous / logged‑out                          */
  /* ------------------------------------------------------------------------ */
  static currentViewerForRequest(
    _req: Request,
  ): Promise<CurrentViewerLoggedOut> {
    // Phase‑0: always treat as anonymous. Later we’ll parse cookies / headers.
    return Promise.resolve(new CurrentViewerLoggedOut());
  }
}

/* -------------------------------------------------------------------------- */
/*  Concrete subclasses                                                       */
/* -------------------------------------------------------------------------- */

export class CurrentViewerLoggedIn extends CurrentViewer {
  constructor(id: string, email: string) {
    super(id, email);
  }
}

export class CurrentViewerLoggedOut extends CurrentViewer {
  constructor() {
    super("anonymous");
  }
}

/* -------------------------------------------------------------------------- */
/*  End of file                                                               */
/* -------------------------------------------------------------------------- */
