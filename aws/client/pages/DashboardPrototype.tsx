import { React } from "aws/client/deps.ts";
import PageFrame from "aws/client/components/PageFrame.tsx";
import ProjectTasks from "aws/client/components/dashboard/ProjectTasks.tsx";
import CustomerCalendar from "aws/client/components/dashboard/CustomerCalendar.tsx";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";

const styles: Record<string, React.CSSProperties> = {
  content: {
    padding: "20px 40px",
  },
};

function DashboardContent() {
  return (
    <div>
      <ProjectTasks />
      <CustomerCalendar />
    </div>
  );
}

export default function Dashboard() {
  const enableDashboard = useFeatureFlag("enable_dashboard");
  return (
    <PageFrame xstyle={{ width: "100%" }}>
      <div className="page">
        <div className="header">
          <div className="headerText">Dashboard</div>
        </div>
        <div style={styles.content}>
          {enableDashboard ? <DashboardContent /> : "Coming soon!"}
        </div>
      </div>
    </PageFrame>
  );
}
