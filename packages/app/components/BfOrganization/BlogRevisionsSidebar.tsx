import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { BfDsCopyButton } from "packages/bfDs/components/BfDsCopyButton.tsx";
import { useState } from "react";

export const BlogRevisionsSidebar = iso(`
  field BfOrganization.BlogRevisionsSidebar @component {
     creation {
       revisions{
         revisionTitle
         original
         instructions
         revision
         explanation
       }
     }
  }
`)(
  function BlogRevisionsSidebar(
    { data },
  ) {
    const [showSuggestion, setShowSuggestion] = useState(false);
    return (
      <div className="flexColumn right-side-bar">
        <div className="revisions-container">
          {data?.creation?.revisions?.map((revision, _index) => {
            const [done, setDone] = useState(false);
            const [showExpanded, setShowExpanded] = useState(false);
            const [hidden, setHidden] = useState(false);
            const handleDone = () => {
              setDone(!done);
              setShowExpanded(!showExpanded);
            };
            if (hidden) {
              return null;
            }
            return (
              <div className="revision-item">
                <div className="flexRow gapMedium">
                  <div
                    className={done ? "revision-title-done" : "revision-title"}
                  >
                    {revision?.revisionTitle ?? ""}
                  </div>
                  <BfDsButton
                    kind="overlay"
                    iconLeft={showExpanded ? "arrowDown" : "arrowLeft"}
                    onClick={() => setShowExpanded(!showExpanded)}
                  />
                </div>
                {showExpanded &&
                  (
                    <div className="revision-item">
                      <div className="original-text">{revision?.original}</div>
                      <div>{revision?.instructions}</div>
                      <div className="flexRow alignItemsCenter">
                        <div className="flexRow flex1" style={{ gap: "8px" }}>
                          <BfDsButton
                            kind={done ? "success" : "secondary"}
                            iconLeft="checkCircle"
                            text="Done"
                            onClick={handleDone}
                          />
                          <BfDsButton
                            kind="outline"
                            iconLeft="trash"
                            text="Ignore"
                            onClick={() => setHidden(true)}
                          />
                        </div>
                        <BfDsButton
                          kind={showSuggestion ? "filledSuccess" : "overlay"}
                          iconLeft="sparkle"
                          onClick={() => setShowSuggestion(!showSuggestion)}
                        />
                      </div>
                      {showSuggestion &&
                        (
                          <>
                            <div className="revision-box">
                              {revision?.revision}
                              <div
                                className="flexRow alignItemsCenter"
                                style={{ justifyContent: "space-between" }}
                              >
                                <div style={{ color: "var(--secondaryColor)" }}>
                                  Suggested change
                                </div>
                                <BfDsCopyButton
                                  kind="filledSuccess"
                                  buttonText="Copy"
                                  textToCopy={revision?.revision ?? ""}
                                />
                              </div>
                            </div>
                            <div className="flexColumn">
                              <div className="suggestion-details-explanation-title">
                                Why this is better
                              </div>
                              {revision?.explanation}
                            </div>
                          </>
                        )}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
