import { React } from "deps.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";

export function Sidebar() {
  return (
    <div className="cs-sidebar">
      <div className="cs-logo">
        <BfLogo />
      </div>
      <div>Clip search</div>
      <div>
        <div>Lists</div>
        <div>
          <div>work-life balance</div>
          <div>taxes</div>
        </div>
      </div>
      <div>
        <div>Previous searches</div>
        <div>
          <div>work-life balance</div>
          <div>taxes</div>
          <div>duck</div>
          <div>clouds</div>
        </div>
      </div>
    </div>
  );
}
