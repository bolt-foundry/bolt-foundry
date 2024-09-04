import * as React from "react";
import { SetUpMeeting } from "packages/client/components/SetUpMeeting.tsx";

export function LandingPageSetUpMeeting(): React.ReactElement {
  return (
    <div className="meetingSection flexRow">
      <div style={{ flex: 1.5, alignSelf: "center", padding: "70px" }}>
        <div
          className="marketing-title"
          style={{ fontSize: "40px", color: "white" }}
        >
          Leverage your content
        </div>
        <div
          className="marketing-text"
          style={{ color: "white", textAlign: "left" }}
        >
          Copy that helps to highlight the problem and how we can help
        </div>
      </div>
      <div style={{ flex: 1, alignSelf: "center" }}>
        <SetUpMeeting />
      </div>
    </div>
  );
}
