import { BfDsProgress } from "@bfmono/apps/bfDs/components/BfDsProgress.tsx";

type Props = {
  align?: "left" | "center" | "right";
  element?: React.ReactElement;
  progress?: number;
  text?: string | number;
  meta?: React.ReactElement | string;
};

export function BfDsTableCell(
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
          <BfDsProgress size={24} progress={progress} />}
      </div>
    </div>
  );
}
