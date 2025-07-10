import { iso } from "@bfmono/apps/aibff/gui/__generated__/__isograph/iso.ts";
import React from "react";

export const Hello = iso(`
  field Query.Hello @component {
    hello
  }
`)(function HelloComponent(data: { data: { hello: string } }) {
  return <div>GraphQL says: {data.data.hello}</div>;
});

export const EntrypointHello = iso(`
  field Query.EntrypointHello {
    Hello
  }
`)(function EntrypointHello(data) {
  // data.data.Hello is already a React component from Isograph
  const Body = () => React.createElement(data.data.Hello);
  const title = "Hello - aibff GUI";
  return { Body, title };
});
