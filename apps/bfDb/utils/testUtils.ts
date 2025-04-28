import { CurrentViewer, CurrentViewerLoggedOut } from "apps/bfDb/classes/CurrentViewer.ts";
import { toBfGid } from "apps/bfDb/classes/BfNodeIds.ts";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type LoggedInOpts = {
  /** e-mail that ends up on cv.email and drives bfGid generation            */
  email?: string;
  /** slug used to build bfOid (org “owner” id)                              */
  orgSlug?: string;
};

type LoggedOutOpts = {
  /** if you need a predictable bfOid for permission tests                   */
  orgSlug?: string;
};

/* -------------------------------------------------------------------------- */
/*  Logged-in viewer                                                          */
/* -------------------------------------------------------------------------- */

export function makeLoggedInCv(opts: LoggedInOpts = {}): CurrentViewer {
  const {
    email = "dev@example.com",
    orgSlug = "dev-org",
  } = opts;

  return CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    // `import.meta` is needed only for the internal call-site;
    // callers don’t care, so we just pass the current module’s meta.
    import.meta,
    email,
    orgSlug,
  );
}

/* -------------------------------------------------------------------------- */
/*  Logged-out viewer                                                         */
/* -------------------------------------------------------------------------- */

export function makeLoggedOutCv(opts: LoggedOutOpts = {}): CurrentViewer {
  const {
    orgSlug = "dev-org",
  } = opts;

  // We reuse the same constructor the real implementation uses for
  // anonymous viewers; no auth tokens, just a stub org id.
  return new CurrentViewerLoggedOut(
    /* whatever params the ctor expects for “logged-out” shape … */
    toBfGid(orgSlug), // bfOid
    toBfGid("guest"), // bfGid (guest user)
  );
}
