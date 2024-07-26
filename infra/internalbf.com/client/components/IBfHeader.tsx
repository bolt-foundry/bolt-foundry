import { React } from "deps.ts";

type Props = {
  header?: React.ReactNode;
  headerAction?: React.ReactNode;
};

export function IBfHeader(
  { header, headerAction }: Props,
) {
  return (
    <div className="internalMainHeader">
      <div className="internalMainHeaderContent">
        <h2>{header}</h2>
        <div className="internalMainHeaderActions">
          {headerAction}
        </div>
      </div>
    </div>
  );
}
