import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import { useAppState } from "aws/client/contexts/AppStateContext.tsx";
import Modal from "aws/client/ui_components/Modal.tsx";
import LeftNav from "aws/client/components/LeftNav.tsx";
import Settings from "aws/client/components/Settings.tsx";
import { PageFrameQuery$data } from "aws/__generated__/PageFrameQuery.graphql.ts";
import LoginForm from "aws/client/components/LoginForm.tsx";
import { FullPageSpinner } from "aws/client/components/Spinner.tsx";
import TopNav from "aws/client/components/TopNav.tsx";
import ProjectListMobile from "aws/client/components/ProjectListMobile.tsx";

const { useEffect, useState, Suspense } = React;
const { useLazyLoadQuery } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    display: "flex",
    // set by `row-column` class
    // flexDirection: "row",
    height: "100%",
    position: "relative",
  },
};

const query = await graphql`
  query PageFrameQuery {
    me {
      ...LeftNav_me
      ...ProjectListMobile_me
      ...SettingsQuery_me
    }
  }
`;

type Props = {
  xstyle?: React.CSSProperties;
};

export default function PageFrame(
  { children, xstyle }: React.PropsWithChildren<Props>,
) {
  return <RenderPageFrame xstyle={xstyle}>{children}</RenderPageFrame>;
}

function RenderPageFrame({ children, xstyle }: React.PropsWithChildren<Props>) {
  const { settingsOpen, setSettingsOpen, loginOpen, setLoginOpen } =
    useAppState();
  const [mobileProjectListOpen, setMobileProjectListOpen] = useState(false);
  const data = useLazyLoadQuery(query, {}) as PageFrameQuery$data;
  useEffect(() => {
    if (data.me == null) {
      setLoginOpen(true);
    }
  }, [data.me]);

  return (
    <div className="row-column" style={styles.pageContainer}>
      <div className="mobile-show">
        <TopNav setMobileProjectListOpen={setMobileProjectListOpen} />
      </div>
      <div className="mobile-hide">
        <LeftNav person$key={data.me} />
      </div>
      <div style={xstyle}>
        <Suspense
          fallback={<FullPageSpinner />}
        >
          {children}
        </Suspense>
      </div>
      {mobileProjectListOpen && (
        <Modal
          onClose={() => setMobileProjectListOpen(false)}
          xstyle={{ minHeight: "50vh" }}
        >
          <ProjectListMobile
            person$key={data.me}
            setMobileProjectListOpen={setMobileProjectListOpen}
          />
        </Modal>
      )}
      {settingsOpen && (
        <Modal
          onClose={() => setSettingsOpen(false)}
          xstyle={{ minHeight: "50vh" }}
        >
          <Settings person$key={data.me} />
        </Modal>
      )}
      {loginOpen && (
        <Modal header="You've been logged out, please log back in">
          <LoginForm />
        </Modal>
      )}
    </div>
  );
}
