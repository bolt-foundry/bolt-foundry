import { iso } from "@iso";
import React from "react";

export const Hello = iso(`
  field Query.Hello @component {
    hello
  }
`)(function HelloComponent(data: { data: { hello: string } }) {
  return (
    <div>
      <h2>GraphQL Says:</h2>
      <p>{data.data.hello}</p>
    </div>
  );
});

export const EntrypointHello = iso(`
  field Query.EntrypointHello {
    Hello
  }
`)(function EntrypointHello(data) {
  const Body = () => React.createElement(data.data.Hello);
  const title = "Hello - Bolt Foundry";
  return { Body, title };
});
