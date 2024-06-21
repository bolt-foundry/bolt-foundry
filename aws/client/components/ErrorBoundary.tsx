// deno-lint-ignore-file
// @ts-nocheck
import { React } from "aws/client/deps.ts";
import ErrorPageLoggedOut from "aws/client/components/ErrorPageLoggedOut.tsx";
import { createLogger } from "aws/logs/mod.ts";
import ErrorPage from "aws/client/components/ErrorPage.tsx";
const logError = createLogger("ErrorBoundary", "error");

type ErrorProps = {
  fallback?: React.ReactNode | ((error: Error) => React.ReactNode);
  children: React.ReactNode;
};

type ErrorState = {
  hasError: boolean;
  error: Error;
};

export default class ErrorBoundary
  extends React.Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // TODO log error to posthog
    logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.error && this.state.error.code === "USER_NOT_LOGGED_IN") {
        return <ErrorPageLoggedOut error={this.state.error} />;
      }
      // e.g. <ErrorBoundary fallback={(error) => <ErrorPage error={error} />}>
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error);
      }
      return this.props.fallback ?? <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}
