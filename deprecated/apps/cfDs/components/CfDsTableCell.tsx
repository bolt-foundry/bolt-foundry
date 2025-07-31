import { CfDsProgress } from "@bfmono/apps/cfDs/components/CfDsProgress.tsx";

type Props = {
  align?: "left" | "center" | "right";
  element?: React.ReactElement;
  progress?: number;
  text?: string | number;
  meta?: React.ReactElement | string;
};

export function CfDsTableCell(
  { align = "left", element, progress, text, meta }: Props,
) {
  const showProgress = progress != null && progress > 0 && progress < 100;
  return (
    <div className="table-cell">
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flex: 1, justifyContent: align }}>
          <div className="flexColumn">
            <div>{text}</div>
            <div className="meta">{meta}</div>
          </div>
          {element}
        </div>
        {showProgress &&
          <CfDsProgress size={24} progress={progress} />}
      </div>
    </div>
  );
}
