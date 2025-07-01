import { iso } from "@iso";
import React from "react";

export const Hello = iso(`
  field Query.Hello @component {
    hello
  }
`)(function HelloComponent(data: { hello: string }) {
  return <div>GraphQL says: {data.hello}</div>;
});

export const EntrypointHello = iso(`
  field Query.EntrypointHello {
    Hello
  }
`)(function EntrypointHello(data: unknown) {
  const Body = () => React.createElement(Hello, data.Hello);
  const title = "Hello - aibff GUI";
  return { Body, title };
});
