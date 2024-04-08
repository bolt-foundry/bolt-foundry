import { React } from "deps.ts";
// import { ReactDOMClient } from "packages/client/deps.ts";
import {App} from "packages/client/components/App.tsx";
import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";
// import AppEnvironmentProvider from "packages/client/contexts/AppEnvironmentContext.tsx";
// // @ts-expect-error #techdebt
// import type { Props as EnvironmentProps } from "packages/client/contexts/AppEnvironmentContext.tsx";
import Spinner from "packages/components/Spinner.tsx";
// import { ensurePosthogClientIsSetUp } from "packages/events/mod.ts";

const { Suspense } = React;

// type Props = EnvironmentProps;

const styles = {
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
};

export function Client() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div style={styles.loading}>
            <Spinner size={64} waitIcon={true} />
          </div>
        }
      >
        {/* <AppEnvironmentProvider {...props}> */}
        <App />
        {/* </AppEnvironmentProvider> */}
      </Suspense>
    </ErrorBoundary>
  );
}

// export async function rehydrate(props: Props) {
//   await ensurePosthogClientIsSetUp(props.currentViewer.id, props.featureFlags);
//   const root = document.querySelector("#root");
//   if (root) {
//     // @ts-ignore: hydrateRoot is not in the types for whatever reason.
//     ReactDOMClient.hydrateRoot(root, <Client {...props} />);
//   }
// }

// // @ts-ignore we can leave this alone
// if (globalThis.__ENVIRONMENT__) {
//   // @ts-ignore we can leave this alone
//   await rehydrate(globalThis.__ENVIRONMENT__);
// } else {
//   // @ts-ignore we can leave this alone
//   globalThis.__REHYDRATE__ = rehydrate;
// }
