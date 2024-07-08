import { React } from "aws/client/deps.ts";
import Icon from "aws/client/ui_components/Icon.tsx";
import Spinner from "aws/client/components/Spinner.tsx";

type WorkflowStatusIndicatorType = {
  completed?: boolean;
  error?: boolean;
  pending?: boolean;
  percent?: number;
};
type ProgressType = {
  percent?: number;
};

const base = {
  width: 48,
  height: 48,
  minWidth: 48,
  minHeight: 48,
  borderRadius: "50%",
};
const styles = {
  complete: {
    ...base,
    backgroundColor: "var(--success)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    ...base,
    backgroundColor: "var(--alert)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const RenderProgress = ({ percent = 0 }: ProgressType) => {
  const progressStyle = {
    ...base,
    background:
      `radial-gradient(closest-side, var(--background) 79%, transparent 80% 100%), conic-gradient(var(--success) ${percent}%, var(--border) 0)`,
  };
  return <div className="progressCircle" style={progressStyle} />;
};

const RenderComplete = () => {
  return (
    <div style={styles.complete}>
      <Icon name="check" color={"var(--background)"} />
    </div>
  );
};

const RenderError = () => {
  return (
    <div style={styles.error}>
      <Icon name="cross" color={"var(--background)"} />
    </div>
  );
};

export default function WorkflowStatusIndicator({
  completed,
  error,
  pending,
  percent = 0,
}: WorkflowStatusIndicatorType) {
  // when percent changes, we want to transition the new value with easing using javascript
  const [progress, setProgress] = React.useState(percent);
  const lastPercent = React.useRef(0);
  React.useEffect(() => {
    if (percent !== lastPercent.current) {
      const diff = percent - lastPercent.current;
      const start = lastPercent.current;
      const startTime = new Date().getTime();
      const duration = 250;
      const easeOutQuad = (t: number) => t * (2 - t);
      const animate = () => {
        const now = new Date().getTime();
        const time = Math.min(1, (now - startTime) / duration);
        const eased = easeOutQuad(time);
        setProgress(start + (diff * eased));
        if (time < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
      lastPercent.current = percent;
    }
  }, [percent]);

  if (error === true) return <RenderError />;
  if (completed === true) return <RenderComplete />;
  if (pending === true) return <Spinner size={48} />;
  return <RenderProgress percent={progress} />;
}
