import type React from "react";

// CSS variables for theming (matching original boltFoundry)
const cssVarsString = `:root {
  --primaryColor: #FFD700;
  --text: #FBFBFF;
  --background: #141516;
  --gapSmall: 8px;
  --gapMedium: 16px;
  --gapLarge: 24px;
  --marketingFontFamily: "Bebas Neue", sans-serif;
  --fontFamily: "DM Sans", sans-serif;
  --text010: rgba(251, 251, 255, 0.1);
  --border: rgba(251, 251, 255, 0.2);
}`;

const cssVarsDarkString = `:root[data-theme=dark] {
  --primaryColor: #FFD700;
  --text: #FBFBFF;
  --background: #141516;
}`;

import type { ServerProps } from "@bfmono/apps/boltfoundry-com/contexts/AppEnvironmentContext.tsx";

type Props = React.PropsWithChildren<{
  environment: Record<string, unknown>;
  assetPaths: {
    cssPath?: string;
    jsPath: string;
  };
  serverEnvironment: ServerProps;
}>;

/*
 * This only runs on the server!!!! It should never run on the client.
 */
export function ServerRenderedPage(
  { children, environment, assetPaths, serverEnvironment }: Props,
) {
  // Don't set globalThis.__ENVIRONMENT__ on server side - that's for client hydration only
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bolt Foundry</title>

        {/* CSS Variables */}
        <style
          dangerouslySetInnerHTML={{
            __html: cssVarsString + cssVarsDarkString,
          }}
        />

        {/* Body reset */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                margin: 0;
                padding: 0;
                font-family: var(--fontFamily);
                background-color: var(--background);
                color: var(--text);
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              `document.documentElement.setAttribute("data-theme", "dark");`,
          }}
        />

        {/* Static CSS imports */}
        <link rel="stylesheet" href="/static/bfDsStyle.css" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@200;400;500;700&family=Bebas+Neue&display=swap&family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link
          rel="shortcut icon"
          type="image/jpg"
          href="https://bolt-foundry-assets.s3.us-east-2.amazonaws.com/favicon.ico"
        />

        <script type="module" src={assetPaths.jsPath} />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
        <script
          type="module"
          defer
          dangerouslySetInnerHTML={{
            __html: `
          console.log("🔧 Client-side hydration enabled");
          globalThis.__ENVIRONMENT__ = ${
              JSON.stringify(serverEnvironment ?? {})
            };

          if (globalThis.__REHYDRATE__) {
            console.log("🔧 Calling __REHYDRATE__");
            try {
              await globalThis.__REHYDRATE__(globalThis.__ENVIRONMENT__);
              console.log("🔧 __REHYDRATE__ call completed");
            } catch (error) {
              console.error("🔧 __REHYDRATE__ call failed:", error);
            }
          } else {
            console.warn("🔧 Rehydration fail - __REHYDRATE__ not found");
          }
          `,
          }}
        />
      </body>
    </html>
  );
}
