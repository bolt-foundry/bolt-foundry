import type { BfGid } from "@bfmono/lib/types.ts";
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

type BaseOpts = {
  orgSlug?: string;
  bfGid?: BfGid;
};

type LoggedInOpts = BaseOpts & {
  email?: string;
};

export function makeLoggedInCv(opts: LoggedInOpts = {}): CurrentViewer {
  const {
    email = "dev@example.com",
    orgSlug = "dev-org",
    bfGid,
  } = opts;

  return CurrentViewer.__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
    import.meta,
    bfGid ?? email,
    orgSlug,
  );
}

type LoggedOutOpts = BaseOpts;
export function makeLoggedOutCv(_opts: LoggedOutOpts = {}): CurrentViewer {
  // Unused variables prefixed with underscore to satisfy linter
  // const {
  //   _orgSlug = "dev-org",
  //   _bfGid = "guest" as BfGid,
  // } = _opts;

  // Use the static factory method instead of calling the constructor directly
  return CurrentViewer.makeLoggedOutCv();
}
