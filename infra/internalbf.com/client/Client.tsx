import { getLogger, React } from "deps.ts";
import { ReactDOMClient } from "packages/client/deps.ts";
import { App } from "infra/internalbf.com/client/components/App.tsx";
import { ErrorBoundary } from "packages/client/components/ErrorBoundary.tsx";
import type { ServerProps } from "infra/internalbf.com/client/contexts/AppEnvironmentContext.tsx";
import { Spinner } from "packages/bfDs/Spinner.tsx";
import AppEnvironmentProvider from "infra/internalbf.com/client/contexts/AppEnvironmentContext.tsx";
import { BfDsProvider } from "packages/bfDs/contexts/BfDsContext.tsx";
// import { ensurePosthogClientIsSetUp } from "packages/events/mod.ts";

const logger = getLogger(import.meta);

const { Suspense } = React;

const styles = {
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
};

export function Client(props: ServerProps) {
  return (
    <BfDsProvider>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div style={styles.loading}>
              <Spinner size={64} waitIcon={true} />
            </div>
          }
        >
          <AppEnvironmentProvider {...props}>
            <App />
          </AppEnvironmentProvider>
        </Suspense>
      </ErrorBoundary>
    </BfDsProvider>
  );
}

export function rehydrate(props: unknown) {
  // await ensurePosthogClientIsSetUp(props.currentViewer.id, props.featureFlags);
  const root = document.querySelector("#root");
  if (root) {
    logger.debug("rehydrating root", root);
    // @ts-expect-error this seems like a react typing bug, not sure why this isn't typed.
    ReactDOMClient.hydrateRoot(root, <Client {...props} />);
  } else {
    logger.error("couldn't rehydrate, root not found");
  }
}

// @ts-expect-error Not typed on the window yet
if (globalThis.__ENVIRONMENT__) {
  // @ts-expect-error Not typed on the window yet
  rehydrate(globalThis.__ENVIRONMENT__);
} else {
  // @ts-expect-error Not typed on the window yet
  globalThis.__REHYDRATE__ = rehydrate;
}
