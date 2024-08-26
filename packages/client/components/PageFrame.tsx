import { React, ReactRelay } from "deps.ts";
import { useAppState } from "packages/client/contexts/AppStateContext.tsx";
import { BfDsModal } from "packages/bfDs/BfDsModal.tsx";
import { LeftNav } from "packages/client/components/LeftNav.tsx";
import { Settings } from "packages/client/components/Settings.tsx";
import { LoginForm } from "packages/client/components/LoginForm.tsx";
import { BfDsFullPageSpinner } from "packages/bfDs/BfDsSpinner.tsx";
import { TopNav } from "packages/client/components/TopNav.tsx";
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

export function PageFrame(
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
        <TopNav setMobileProjectListOpen={setMobileProjectListOpen} />
      </div>
      <div className="mobile-hide">
        <LeftNav person$key={data.me} />
      </div>
      <div style={xstyle}>
        <Suspense
          fallback={<BfDsFullPageSpinner />}
        >
          {children}
        </Suspense>
      </div>
      {mobileProjectListOpen && (
        <BfDsModal
          onClose={() => setMobileProjectListOpen(false)}
          xstyle={{ minHeight: "50vh" }}
        >
          <ProjectListMobile
            person$key={data.me}
            setMobileProjectListOpen={setMobileProjectListOpen}
          />
        </BfDsModal>
      )}
      {settingsOpen && (
        <BfDsModal
          onClose={() => setSettingsOpen(false)}
          xstyle={{ minHeight: "50vh" }}
        >
          <Settings person$key={data.me} />
        </BfDsModal>
      )}
      {loginOpen && (
        <BfDsModal header="You've been logged out, please log back in">
          <LoginForm />
        </BfDsModal>
      )}
    </div>
  );
}
