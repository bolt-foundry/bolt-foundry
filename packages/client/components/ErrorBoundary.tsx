// deno-lint-ignore-file
import { React } from "deps.ts";
import { ErrorPage } from "packages/client/components/ErrorPage.tsx";

type ErrorProps = {
  fallback?: React.ReactNode | ((error?: Error) => React.ReactNode);
  children: React.ReactNode;
};

type ErrorState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
  state: ErrorState = {
    hasError: false,
    error: undefined,
  };
  props: ErrorProps;
  constructor(props: ErrorProps) {
    super(props);
    this.props = props;
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // TODO log error to posthog
    // logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      // e.g. <ErrorBoundary fallback={(error) => <ErrorPage error={error} />}>
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error);
      }
      return this.props.fallback ?? <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}
