import type { BfGid } from "lib/types.ts";
import {
  CurrentViewer,
  CurrentViewerLoggedOut,
} from "apps/bfDb/classes/CurrentViewer.ts";

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
export function makeLoggedOutCv(opts: LoggedOutOpts = {}): CurrentViewer {
  const {
    orgSlug = "dev-org",
    bfGid = "guest" as BfGid,
  } = opts;

  // Use the static factory method instead of calling the constructor directly
  return CurrentViewer.makeLoggedOutCv();
}
