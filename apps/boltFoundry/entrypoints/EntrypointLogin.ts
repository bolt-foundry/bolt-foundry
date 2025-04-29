/* -------------------------------------------------------------------------- */
/* 2️⃣  EntrypointLogin – router entry                                         */

import { iso } from "@iso/iso.ts";

/* -------------------------------------------------------------------------- */
export const EntrypointLogin = iso(`
  field Query.EntrypointLogin {
    LoginPage
  }
`)(function EntrypointLogin({ data }) {
  const Body = data.LoginPage;
  const title = "Sign in – Bolt Foundry";
  return { Body, title };
});
