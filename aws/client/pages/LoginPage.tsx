import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import MarketingFrame from "aws/client/components/MarketingFrame.tsx";
import Button from "aws/client/ui_components/Button.tsx";
import { LoginPageQuery } from "aws/__generated__/LoginPageQuery.graphql.ts";
import Spinner from "aws/client/components/Spinner.tsx";
import LoginForm from "aws/client/components/LoginForm.tsx";
import { Link } from "aws/client/components/Link.tsx";
import { captureEvent } from "aws/events/mod.ts";
import { LoginPageCVQuery } from "aws/__generated__/LoginPageCVQuery.graphql.ts";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";

const { useQueryLoader, usePreloadedQuery, useMutation, useLazyLoadQuery } =
  ReactRelay;
const { Suspense, useEffect } = React;

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: "auto",
    padding: "0 10%",
  },
  content: {
    width: "60vw",
    maxWidth: "100%",
  },
  error: {
    background: "var(--backgroundAlert)",
    padding: 12,
    borderRadius: 8,
    border: "1px solid var(--alert)",
  },
};

const logoutMutation = await graphql`
  mutation LoginPageLogoutMutation {
    logout {
      name
      }
    }
`;

const query = await graphql`
  query LoginPageQuery {
    me {
      name
      id
    }
  }`;

const cvQuery = await graphql`
  query LoginPageCVQuery {
    currentViewer {
      person {
        name
      }
    }
  }`;

function LoginPageContent(
  { preloadedQuery }: {
    preloadedQuery: ReactRelay.PreloadedQuery<LoginPageQuery>;
  },
) {
  const data = usePreloadedQuery(query, preloadedQuery);
  const cvData = useLazyLoadQuery<LoginPageCVQuery>(cvQuery, {});

  const [logoutError, setLogoutError] = React.useState<string | null>(null);
  const [logoutCommit, logoutInFlight] = useMutation(logoutMutation);

  const loggedInPerson = cvData?.currentViewer?.person;
  const loggedIn =
    (data?.me?.id != null && !data?.me?.id?.startsWith("LoggedOutPerson")) ||
    loggedInPerson != null;

  useEffect(() => {
    captureEvent("loginPage", "loaded");
  }, []);

  const onLogout = () => {
    logoutCommit({
      variables: {},
      onCompleted: (response, errors) => {
        if (errors) {
          const errorMessage = errors.map((e: { message: string }) => e.message)
            .join(", ");
          setLogoutError(errorMessage);
        } else {
          window.location.assign("/"); // TODO fix navigate() in RouterContext
        }
      },
      onError: (error) => {
        setLogoutError(error.message);
      },
    });
  };

  const me = data?.me;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {loggedInPerson && (
          <div>
            Logged in as {loggedInPerson.name}. Not you?{" "}
            <Button
              showSpinner={logoutInFlight}
              text="Logout"
              onClick={onLogout}
            />
          </div>
        )}
        {loggedIn && me
          ? (
            <div>
              <div>
                Logged in{me.name != null && ` as ${me.name}`}. Not you?{" "}
                <Button
                  showSpinner={logoutInFlight}
                  text="Logout"
                  onClick={onLogout}
                />
              </div>
              <div style={{ marginTop: 20 }}>
                Head over to your <Link to="/projects">projects</Link>.
              </div>
              {logoutError && <div style={styles.error}>{logoutError}</div>}
            </div>
          )
          : <LoginForm />}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [queryReference, loadQuery] = useQueryLoader<LoginPageQuery>(query);
  const [error, setError] = React.useState<Error | null>(null);
  React.useEffect(() => {
    try {
      loadQuery({});
    } catch (err) {
      setError(err);
    }
  }, [loadQuery]);

  const spinner = (
    <div style={styles.container}>
      <div style={styles.content}>
        <Spinner backgroundColor={"var(--background)"} />
      </div>
    </div>
  );

  if (error) {
    // If there's an error (meaning the user isn't logged in), show the login form.
    return <LoginForm />;
  }

  return queryReference != null
    ? (
      <MarketingFrame header="Welcome back!">
        <Suspense fallback={spinner}>
          <LoginPageContent preloadedQuery={queryReference} />
        </Suspense>
      </MarketingFrame>
    )
    : null;
}
