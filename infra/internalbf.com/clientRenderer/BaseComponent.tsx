import { React } from "deps.ts";
import { colors, colorsDark, fonts } from "packages/bfDs/const.tsx";

const varsString = Object.entries({ ...colors, ...fonts }).reduce(
  (acc, [key, value]) => {
    acc += `--${key}: ${value};\n`;
    return acc;
  },
  "",
);
const varsDarkString = Object.entries({ ...colorsDark }).reduce(
  (acc, [key, value]) => {
    acc += `--${key}: ${value};\n`;
    return acc;
  },
  "",
);

const cssVarsString = `:root {\n${varsString}}\n`;
const cssVarsDarkString = `:root[data-theme="dark"] {\n${varsDarkString}}\n`;

type Props = React.PropsWithChildren<{
  environment: Record<string, unknown>;
}>;

/*
 * This only runs on the server!!!! It should never run on the client.
 */
export function BaseComponent({ children, environment }: Props) {
  return (
    <html lang="en">
      <head>
        <script
          type="module"
          async
          src="/build/infra/internalbf.com/client/Client.js"
          id="client-script"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="shortcut icon"
          type="image/jpg"
          href="https://bf-static-assets.s3.amazonaws.com/favicon.ico"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@200;400;500;700&family=Ubuntu:wght@400;500;700&family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/resources/style.css" />
        <link
          rel="stylesheet"
          href="/infra/internalbf.com/resources/style.css"
        />
        <title>Bolt Foundry - Social media clips without the effort</title>
        <meta
          name="description"
          content="Bolt Foundry is a video clipping tool, this page displays how it works and information about it."
        />
        <meta
          name="keywords"
          content="clip, editing, video, bolt, short-form-content"
        />
        <style>
          {cssVarsString}
          {cssVarsDarkString}
        </style>
        <meta
          name="facebook-domain-verification"
          content="jsbypii8xiycnh18rbgnnsvhwmtbum"
        />
        <script src="https://accounts.google.com/gsi/client" async></script>
        <script async defer src="https://apis.google.com/js/api.js"></script>
        {/* @ts-expect-error */}
        <script __dangerouslysetinnerhtml="!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1638516373304621');
            fbq('track', 'PageView');" />
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js-na1.hs-scripts.com/44883226.js"
        >
        </script>
        <script
          async
          src="https://tag.clearbitscripts.com/v1/pk_a015643f7768419667589e0ee9fab1b0/tags.js"
          referrerPolicy="strict-origin-when-cross-origin"
        >
        </script>
      </head>
      <body>
        <div id="root">
          {children}
        </div>
        <div id="modal-root"></div>
        <div id="tooltip-root"></div>
        <div id="toast-root"></div>
        <script
          type="module"
          defer={true}
          dangerouslySetInnerHTML={{
            __html: `globalThis.__ENVIRONMENT__ = ${
              JSON.stringify(environment)
            };

          function adjustAppHeight() {
            let appHeight = window.innerHeight;
            document.documentElement.style.setProperty('--app-height', \`\${appHeight}px\`);
            
          }
          window.addEventListener('resize', adjustAppHeight);
          window.addEventListener('orientationchange', adjustAppHeight);
          adjustAppHeight();

          if (globalThis.__REHYDRATE__) {
            globalThis.__REHYDRATE__(globalThis.__ENVIRONMENT__);
          } else {
            // can't rehydrate yet. 
          }`,
          }}
        />
      </body>
    </html>
  );
}
