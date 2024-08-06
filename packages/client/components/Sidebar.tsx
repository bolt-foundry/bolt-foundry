import { React } from "deps.ts";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";

type Props = {
  contents: React.ReactNode;
  footer?: React.ReactNode;
  header?: string;
};

export function Sidebar({ contents, footer, header }: Props) {
  return (
    <div className="cs-sidebar">
      <div className="cs-sidebar-title">
        <div className="icon">
          <BfSymbol />
        </div>{" "}
        {header ?? "Bolt Foundry"}
      </div>
      <div className="cs-sidebar-content">
        {contents}
      </div>
      {footer && (
        <div className="cs-sidebar-footer">
          {footer}
        </div>
      )}
    </div>
  );
}
