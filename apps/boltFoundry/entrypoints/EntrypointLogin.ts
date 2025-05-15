/* -------------------------------------------------------------------------- */
/* 2️⃣  EntrypointLogin – router entry                                         */

import { iso } from "@iso/iso.ts";
import React from "react";

/* -------------------------------------------------------------------------- */
export const EntrypointLogin = iso(`
  field Query.EntrypointLogin {
    __typename
  }
`)(function EntrypointLogin() {
  // const Body = data.LoginPage;
  const Body = () => React.createElement("div", null, "login page");
  const title = "Sign in – Bolt Foundry";
  return { Body, title };
});
