import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfDsCopyButton } from "apps/bfDs/components/BfDsCopyButton.tsx";
import { useRef, useState } from "react";
import { classnames } from "lib/classnames.ts";
import { useEditor } from "apps/boltFoundry/contexts/EditorContext.tsx";
import {
  BfDsListItem,
  type BfDsListItemHandle,
} from "apps/bfDs/components/BfDsListItem.tsx";

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
  const {
    highlightTextInEditor,
    unhighlightTextInEditor,
    replaceTextInEditor,
  } = useEditor();
  const [originalTextExpanded, setOriginalTextExpanded] = useState(false);
  const [done, setDone] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showSuggestionExplanation, setShowSuggestionExplanation] = useState(
    false,
  );
  const [searchText, setSearchText] = useState<string | null>(
    revision?.original ?? null,
  );
  const [hidden, setHidden] = useState(false);
  const listItemRef = useRef<BfDsListItemHandle>(null);

  const handleHighlight = () => {
    if (searchText) {
      highlightTextInEditor(searchText);
    }
  };
  const handleReplaceText = () => {
    if (searchText) {
      if (searchText === revision?.revision && revision?.original) {
        replaceTextInEditor(searchText, revision.original);
        setSearchText(revision.original);
      } else if (revision?.revision) {
        replaceTextInEditor(searchText, revision.revision);
        setSearchText(revision.revision);
      }
    }
  };

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
      handleHighlight();
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
          handleHighlight();
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
              <div className="flexRow gapMedium selfAlignEnd">
                <BfDsCopyButton
                  kind="outlineSuccess"
                  buttonText="Copy"
                  textToCopy={revision?.revision ?? ""}
                />
                <BfDsButton
                  kind={searchText && searchText !== revision?.revision
                    ? "success"
                    : "secondary"}
                  text={searchText && searchText !== revision?.revision
                    ? "Replace"
                    : "Revert"}
                  onClick={handleReplaceText}
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
