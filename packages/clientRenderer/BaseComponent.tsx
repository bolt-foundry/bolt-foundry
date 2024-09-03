import type { React } from "deps.ts";
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
const cssVarsDarkString = `:root[data-theme=dark] {\n${varsDarkString}}\n`;

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
          src="/build/packages/client/Client.js"
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
        <link rel="stylesheet" href="/resources/clipSearchStyle.css" />
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
          content={`${environment.FB_DOMAIN_AUTH_ID}`}
        />
        <script src="https://accounts.google.com/gsi/client" async></script>
        <script async defer src="https://apis.google.com/js/api.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${environment.META_PIXEL_ID});
            fbq('track', 'PageView');`,
          }}
        />
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src={`//js-na1.hs-scripts.com/${environment.HUBSPOT_API_KEY}.js`}
        >
        </script>
        <script
          async
          src={`https://tag.clearbitscripts.com/v1/${environment.CLEARBIT_API_KEY}/tags.js`}
          referrerPolicy="strict-origin-when-cross-origin"
        >
        </script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init push capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('${environment.POSTHOG_API_KEY}',{api_host:'https://us.i.posthog.com', person_profiles: 'always'
        })`,
          }}
        />
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
