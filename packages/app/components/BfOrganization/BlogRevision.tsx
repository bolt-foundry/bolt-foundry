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
  const [originalTextExpanded, setOriginalTextExpanded] = useState(false);
  const [done, setDone] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showSuggestionExplanation, setShowSuggestionExplanation] = useState(
    false,
  );
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
  const originalClasses = classnames([
    "revision-item-original-text",
    {
      collapsed: !originalTextExpanded,
    },
  ]);

  const expandedContent = (
    <div className="revision-item">
      <div
        className="revision-item-original"
        onClick={() => {
          setOriginalTextExpanded(!originalTextExpanded);
          if (revision?.original) {
            highlightTextInEditor(revision.original);
          }
        }}
      >
        <div className="revision-item-small-title">Original text</div>
        <div className={originalClasses}>
          {revision?.original}
        </div>
      </div>
      {showSuggestion
        ? (
          <div>
            <div className="revision-item-subtitle">Suggestion</div>
            <div className="revision-box">
              {revision?.revision}
            </div>
            <div className="flexRow gapMedium">
              <div className="flex1">
                <BfDsButton
                  iconLeft={showSuggestionExplanation
                    ? "infoCircleSolid"
                    : "infoCircle"}
                  kind={showSuggestionExplanation
                    ? "filledSecondary"
                    : "overlay"}
                  onClick={() =>
                    setShowSuggestionExplanation(!showSuggestionExplanation)}
                  size="medium"
                />
              </div>
              <div className="flexRow selfAlignEnd">
                <BfDsCopyButton
                  kind="filledSuccess"
                  buttonText="Copy"
                  textToCopy={revision?.revision ?? ""}
                />
              </div>
            </div>
            {showSuggestionExplanation && (
              <div className="revision-item-explanation flexColumn">
                <div className="suggestion-details-explanation-title">
                  Why this is better
                </div>
                {revision?.explanation}
              </div>
            )}
          </div>
        )
        : (
          <div>
            <div className="revision-item-subtitle">
              How to make this better
            </div>
            <div className="revision-item-instruction">
              {revision?.instructions}
            </div>
          </div>
        )}
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
