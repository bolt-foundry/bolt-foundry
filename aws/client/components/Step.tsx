import { React } from "aws/client/deps.ts";
import WorkflowStatusIndicator from "aws/client/components/WorkflowStatusIndicator.tsx";

type StepGenerateType = {
  complete: boolean;
  errorText?: string | null;
  pending?: boolean;
  percent?: number;
  completeText?: string;
  initialText: string;
  pendingText?: string;
  subtitle?: string | React.ReactElement | null;
};

const styles: Record<string, React.CSSProperties> = {
  step: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "var(--text)",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "var(--textSecondary)",
  },
};

function Step(
  {
    complete,
    errorText,
    pending,
    percent,
    completeText,
    initialText,
    pendingText,
    subtitle,
  }: StepGenerateType,
) {
  let title = initialText;
  if (pending === true) title = pendingText || initialText;
  if (complete === true) title = completeText || initialText;
  if (errorText != null) title = errorText;

  return (
    <div style={styles.step}>
      <WorkflowStatusIndicator
        completed={complete}
        error={errorText != null}
        pending={pending}
        percent={percent}
      />
      <div style={styles.text}>
        <div style={styles.title}>{title}</div>
        {errorText == null && subtitle != null && (
          <div style={styles.subtitle}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}

export default Step;
