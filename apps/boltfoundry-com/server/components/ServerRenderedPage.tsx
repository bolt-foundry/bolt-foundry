import type React from "react";

type Props = React.PropsWithChildren<{
  environment: Record<string, unknown>;
}>;

/*
 * This only runs on the server!!!! It should never run on the client.
 */
export function ServerRenderedPage({ children, environment }: Props) {
  // Make environment available during SSR
  // @ts-expect-error - Setting up global for SSR
  globalThis.__ENVIRONMENT__ = environment;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bolt Foundry</title>
        <link rel="stylesheet" href="/static/index.css" />
        <script type="module" src="/static/build/ClientRoot.js" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
        <script
          type="module"
          defer
          dangerouslySetInnerHTML={{
            __html: `globalThis.__ENVIRONMENT__ = ${
              JSON.stringify(environment ?? {})
            };

          if (globalThis.__REHYDRATE__) {
            console.debug("Trying to rehydrate");
            await globalThis.__REHYDRATE__(globalThis.__ENVIRONMENT__);
          } else {
            // can't rehydrate yet.
            console.warn("Rehydration fail");
          }
          `,
          }}
        />
      </body>
    </html>
  );
}
