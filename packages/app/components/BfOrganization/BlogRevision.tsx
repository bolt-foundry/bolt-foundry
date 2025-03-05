import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { BfDsCopyButton } from "packages/bfDs/components/BfDsCopyButton.tsx";
import { useRef, useState } from "react";
import { classnames } from "lib/classnames.ts";
import { useEditor } from "packages/app/contexts/EditorContext.tsx";
import {
  BfDsListItem,
  type BfDsListItemHandle,
} from "packages/bfDs/components/BfDsListItem.tsx";

type Props = {
  revision: {
    revisionTitle: string | null;
    original: string | null;
    instructions: string | null;
    revision: string | null;
    explanation: string | null;
  } | null;
};

export function BlogRevision({ revision }: Props) {
  const { highlightTextInEditor, unhighlightTextInEditor } = useEditor();
  const [done, setDone] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [hidden, setHidden] = useState(false);
  const listItemRef = useRef<BfDsListItemHandle>(null);

  const handleDone = () => {
    setDone(!done);
    // When marking as done, collapse the item
    if (!done) {
      listItemRef.current?.setExpand(false);
    }
  };
  const handleExpanding = (newExpandingState?: boolean) => {
    // If the revision has an original text, highlight it in the editor
    if (newExpandingState) {
      if (revision?.original) {
        highlightTextInEditor(revision.original);
      }
    } else {
      unhighlightTextInEditor();
    }
  };
  if (hidden) {
    return null;
  }
  const titleClasses = classnames([
    "revision-item-title",
    {
      done,
    },
  ]);

  const expandedContent = (
    <div className="revision-item">
      <div
        className="original-text"
        onClick={() => {
          if (revision?.original) {
            highlightTextInEditor(revision.original);
          }
        }}
      >
        {revision?.original}
      </div>
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
  );

  return (
    <BfDsListItem
      ref={listItemRef}
      content={
        <span className={titleClasses}>{revision?.revisionTitle ?? ""}</span>
      }
      expandedContent={expandedContent}
      expandCallback={(newExpandingState) => handleExpanding(newExpandingState)}
    />
  );
}
