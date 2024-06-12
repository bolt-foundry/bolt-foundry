import { React, ReactRelay } from "deps.ts";
import { useAppState } from "packages/client/contexts/AppStateContext.tsx";
import { Modal } from "packages/bfDs/Modal.tsx";
import { InternalBfLeftNav } from "packages/client/components/InternalBfLeftNav.tsx";
import { Settings } from "packages/client/components/Settings.tsx";
import { LoginForm } from "packages/client/components/LoginForm.tsx";
import { FullPageSpinner } from "packages/bfDs/Spinner.tsx";
import { InternalBfTopNav } from "packages/client/components/InternalBfTopNav.tsx";
import { ProjectListMobile } from "packages/client/components/ProjectListMobile.tsx";

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

// const query = await graphql`
//   query PageFrameQuery {
//     me {
//       ...LeftNav_me
//       ...ProjectListMobile_me
//       ...SettingsQuery_me
//     }
//   }
// `;

type Props = {
  xstyle?: React.CSSProperties;
};

export function InternalBfPageFrame(
  { children, xstyle }: React.PropsWithChildren<Props>,
) {
  return <RenderPageFrame xstyle={xstyle}>{children}</RenderPageFrame>;
}

function RenderPageFrame({ children, xstyle }: React.PropsWithChildren<Props>) {
  const { settingsOpen, setSettingsOpen, loginOpen, setLoginOpen } =
    useAppState();
  const [mobileProjectListOpen, setMobileProjectListOpen] = useState(false);
  // const data = useLazyLoadQuery(query, {}) as PageFrameQuery$data;
  const data = { me: {} };
  useEffect(() => {
    if (data.me == null) {
      setLoginOpen(true);
    }
  }, [data.me]);

  return (
    <div className="row-column" style={styles.pageContainer}>
      <div className="mobile-show">
        <InternalBfTopNav setMobileProjectListOpen={setMobileProjectListOpen} />
      </div>
      <div className="mobile-hide">
        <InternalBfLeftNav person$key={data.me} />
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
