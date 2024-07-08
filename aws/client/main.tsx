//client.tsx
import { React } from "aws/client/deps.ts";
import { ReactDOMClient } from "aws/client/deps.ts";
import App from "aws/client/components/App.tsx";
import ErrorBoundary from "aws/client/components/ErrorBoundary.tsx";
import AppEnvironmentProvider from "aws/client/contexts/AppEnvironmentContext.tsx";
// @ts-expect-error #techdebt
import type { Props as EnvironmentProps } from "aws/client/contexts/AppEnvironmentContext.tsx";
import Spinner from "aws/client/components/Spinner.tsx";
import { ensurePosthogClientIsSetUp } from "aws/events/mod.ts";

const { Suspense } = React;

type Props = EnvironmentProps;

const styles = {
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
};

export default function Client(props: Props) {
  return (
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
  );
}

export async function rehydrate(props: Props) {
  await ensurePosthogClientIsSetUp(props.currentViewer.id, props.featureFlags);
  const root = document.querySelector("#root");
  if (root) {
    // @ts-ignore: hydrateRoot is not in the types for whatever reason.
    ReactDOMClient.hydrateRoot(root, <Client {...props} />);
  }
}

// @ts-ignore we can leave this alone
if (globalThis.__ENVIRONMENT__) {
  // @ts-ignore we can leave this alone
  await rehydrate(globalThis.__ENVIRONMENT__);
} else {
  // @ts-ignore we can leave this alone
  globalThis.__REHYDRATE__ = rehydrate;
}
