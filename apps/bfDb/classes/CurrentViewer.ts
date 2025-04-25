/* -------------------------------------------------------------------------- */
/*  CurrentViewer – Phase‑0 stub                                              */
/*  Location: apps/bfDb/classes/CurrentViewer.ts                              */
/*                                                                            */
/*  This is the first implementation step for the new viewer model.           */
/*  It purposefully stays minimal: just enough to turn the red tests for       */
/*  CurrentViewer green while we migrate away from BfCurrentViewer.           */
/* -------------------------------------------------------------------------- */

import { defineGqlNode } from "../graphql/builder/builder.ts";
import { BfCurrentViewer } from "./BfCurrentViewer.ts";
import { BfErrorInvalidEmail } from "./BfErrorInvalidEmail.ts";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Simple RFC‑5322‑ish e‑mail matcher – good enough for dev stubs. */
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

type ViewerState = "CurrentViewerLoggedIn" | "CurrentViewerLoggedOut";

export class CurrentViewer {
  /* ------------------------------------------------------------------------ */
  /*  GraphQL spec (builder DSL)                                              */
  /* ------------------------------------------------------------------------ */
  static gqlSpec = defineGqlNode((field) => {
    field.id("id");
    field.string("email");
  });

  /* ------------------------------------------------------------------------ */
  /*  Instance fields                                                         */
  /* ------------------------------------------------------------------------ */
  readonly __typename: ViewerState;
  readonly id: string;
  readonly email?: string;

  private constructor(state: ViewerState, id: string, email?: string) {
    this.__typename = state;
    this.id = id;
    this.email = email;
  }

  /* ------------------------------------------------------------------------ */
  /*  Dev‑only e‑mail login helper                                            */
  /* ------------------------------------------------------------------------ */
  // deno-lint-ignore require-await
  static async loginWithEmailDev(email: string): Promise<CurrentViewer> {
    if (!EMAIL_REGEX.test(email)) {
      throw new BfErrorInvalidEmail(email);
    }

    // Re‑use the existing BfCurrentViewer logic so we don't duplicate
    // token / storage behaviour during the migration.
    const bfCv = BfCurrentViewer
      .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        email.split("@")[0], // name – temporary
        email,
      );

    return new CurrentViewer("CurrentViewerLoggedIn", bfCv.bfGid, email);
  }

  /* ------------------------------------------------------------------------ */
  /*  Request‑scoped helper – anonymous / logged‑out                          */
  /* ------------------------------------------------------------------------ */
  static currentViewerForRequest(_req: Request): Promise<CurrentViewer> {
    // Phase‑0: always treat as anonymous. Later we’ll parse cookies / headers.
    return Promise.resolve(
      new CurrentViewer("CurrentViewerLoggedOut", "anonymous"),
    );
  }
}

/* -------------------------------------------------------------------------- */
/*  End of file                                                               */
/* -------------------------------------------------------------------------- */
