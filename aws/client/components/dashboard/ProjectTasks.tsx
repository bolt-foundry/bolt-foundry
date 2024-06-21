import { React } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";

const { useEffect, useState } = React;

export default function Customers() {
  return (
    <div className="dashboardSection">
      <div className="dashboardHeader">
        Project tasks
      </div>
      <div className="dashboardContent">
        <div className="projectTask">
          <div
            className="projectThumbnail"
            style={{
              background:
                "url(https://placekitten.com/g/50/50) no-repeat center center/cover",
            }}
          />
          <div className="projectDetails">
            <div className="projectName">
              TC 2/6 10pm
            </div>
            <div className="projectSubtitle">
              <div className="projectCustomer">Tiny Cupboard</div>
              {/* <div className="projectTag">Something</div> */}
              <div className="projectTag new">New</div>
              {/* <div className="projectTag changed">Changes</div> */}
            </div>
          </div>
          <div className="projectActions">
            <Button kind="outline" iconLeft="comment" size="medium" />
            <Button kind="outline" text="Open" />
          </div>
        </div>
        <div className="projectTask">
          <div
            className="projectThumbnail"
            style={{
              background:
                "url(https://placekitten.com/g/50/51) no-repeat center center/cover",
            }}
          />
          <div className="projectDetails">
            <div className="projectName">
              Friday evening Feb 2nd
            </div>
            <div className="projectSubtitle">
              <div className="projectCustomer">Blue Ridge</div>
              {/* <div className="projectTag">Something</div> */}
              {/* <div className="projectTag new">New</div> */}
              <div className="projectTag changed">Changes</div>
            </div>
          </div>
          <div className="projectActions">
            <Button
              kind="filledSuccess"
              iconLeft="commentSolid"
              size="medium"
            />
            <Button kind="outline" text="Open" />
          </div>
        </div>
        <div className="projectTask">
          <div
            className="projectThumbnail"
            style={{
              background:
                "url(https://placekitten.com/g/50/50) no-repeat center center/cover",
            }}
          />
          <div className="projectDetails">
            <div className="projectName">
              TC 2/3 8pm
            </div>
            <div className="projectSubtitle">
              <div className="projectCustomer">Tiny Cupboard</div>
              {/* <div className="projectTag">Something</div> */}
              {/* <div className="projectTag new">New</div> */}
              <div className="projectTag changed">Changes</div>
            </div>
          </div>
          <div className="projectActions">
            <Button
              kind="filledSuccess"
              iconLeft="commentSolid"
              size="medium"
            />
            <Button kind="outline" text="Open" />
          </div>
        </div>
      </div>
    </div>
  );
}
