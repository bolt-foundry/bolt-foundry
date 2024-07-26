import { React } from "deps.ts";
import { Progress } from "packages/bfDs/Progress.tsx";

type Props = {
  align?: "left" | "center" | "right";
  element?: React.ReactElement;
  progress?: number;
  text?: string | number;
};

export function TableCell({ align = "left", element, progress, text }: Props) {
  const showProgress = progress != null && progress > 0 && progress < 100;
  return (
    <div className="table-cell">
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flex: 1, justifyContent: align }}>
          <div>{text}</div>
          {element}
        </div>
        {showProgress &&
          <Progress size={24} progress={progress} />}
      </div>
    </div>
  );
}
