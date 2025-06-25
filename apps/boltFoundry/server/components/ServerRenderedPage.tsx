import { colors, colorsDark, fonts } from "@bfmono/apps/cfDs/const.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
const _logger = getLogger(import.meta);

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
  headerElement: React.ReactNode;
}>;

/*
 * This only runs on the server!!!! It should never run on the client.
 */
export function ServerRenderedPage(
  { children, environment, headerElement }: Props,
) {
  // logger.info(cssVarsString, cssVarsDarkString)
  return (
    <html lang="en">
      <head>
        {headerElement}
        <style
          dangerouslySetInnerHTML={{
            __html: cssVarsString + cssVarsDarkString,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              `document.documentElement.setAttribute("data-theme", "dark");`,
          }}
        >
        </script>

        <link rel="stylesheet" href="/static/marketingpagestyle.css" />
        <link rel="stylesheet" href="/static/cfDsStyle.css" />
        <link rel="stylesheet" href="/static/bfDsStyle.css" />
        <link rel="stylesheet" href="/static/blogStyle.css" />
        <link rel="stylesheet" href="/static/formatterStyle.css" />
        <link rel="stylesheet" href="/static/appStyle.css" />
        <link rel="stylesheet" href="/static/landingStyle.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {
          /* <link rel="stylesheet" href="/static/toolsStyle.css" />
        <link rel="stylesheet" href="/static/lexicalStyle.css" /> */
        }
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono&family=DM+Sans:wght@200;400;500;700&family=Bebas+Neue&display=swap&family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
        <link
          rel="shortcut icon"
          type="image/jpg"
          href="https://bolt-foundry-assets.s3.us-east-2.amazonaws.com/favicon.ico"
        />
        <script
          type="module"
          src="/static/build/ClientRoot.js"
        />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
        <div id="modal-root" className="portalRoot"></div>
        <div id="tooltip-root" className="portalRoot"></div>
        <div id="toast-root" className="portalRoot"></div>
        <div id="staging-root" className="portalRoot"></div>
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
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init me ys Ss gs ws capture je Di xs register register_once register_for_session unregister unregister_for_session Rs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Is ks createPersonProfile Ps bs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing $s debug Es getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          if (__ENVIRONMENT__.POSTHOG_API_KEY) {
            posthog.init(__ENVIRONMENT__.POSTHOG_API_KEY, {
                api_host: 'https://us.i.posthog.com',
            })
          }
          `,
          }}
        />
      </body>
    </html>
  );
}
