import { React } from "aws/client/deps.ts";
import { useFeatureFlag } from "aws/client/hooks/featureFlagHooks.tsx";
import { captureEvent } from "aws/events/mod.ts";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { DGWord } from "aws/types/transcript.ts";
import useClickOutside from "aws/client/hooks/useClickOutside.tsx";

const styles: Record<string, React.CSSProperties> = {
  wordMenu: {
    position: "absolute",
    bottom: "100%",
    backgroundColor: "var(--menuBackground)",
    borderRadius: 6,
    left: 0,
    minWidth: 100,
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 12px",
  },
  wordMenuItem: {
    color: "var(--text)",
    fontSize: 14,
    padding: "6px 12px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  wordMenuItemHover: {
    backgroundColor: "var(--menuBackgroundHover)",
  },
  wordMenuText: {
    flexGrow: 1,
  },
  wordMenuArrow: {
    width: 0,
    height: 0,
    borderLeft: "0px solid transparent",
    borderRight: "16px solid transparent",
    borderTop: "10px solid var(--menuBackground)",
    position: "absolute",
    bottom: -6,
    left: 0,
  },
  separator: {
    borderBottom: "1px solid var(--border)",
    height: 0,
    width: "100%",
  },
};

type Props = {
  index: number;
  startIndex: number;
  endIndex: number;
  editingWord: DGWord | null | undefined;
  handleEditWord: () => void;
  handleWordClick: () => void;
  handleTrimWord: () => void;
  setStartIndex: (index: number) => void;
  setEndIndex: (index: number) => void;
  setStartHighlightIndex: (index: number | null) => void;
  setEndHighlightIndex: (index: number | null) => void;
};

export default function WordMenu(
  {
    index,
    startIndex,
    endIndex,
    editingWord,
    handleEditWord,
    handleTrimWord,
    handleWordClick,
    setStartIndex,
    setEndIndex,
    setStartHighlightIndex,
    setEndHighlightIndex,
  }: Props,
) {
  const { currentViewer: { id: personId } } = useAppEnvironment();
  const [hover, setHover] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const enableWordEditing = useFeatureFlag("enable_word_editing");

  useClickOutside(menuRef, handleWordClick, {
    isActive: !editingWord,
    ignoreParent: true,
  });

  const showStart = index < endIndex && index !== startIndex;
  const showEnd = index > startIndex && index !== endIndex;
  const showTrimEnd = index === endIndex;

  return (
    <>
      <div style={styles.wordMenu} ref={menuRef}>
        {showStart && (
          <div
            onMouseEnter={() => {
              setStartHighlightIndex(index);
              setHover("start");
            }}
            onMouseLeave={() => {
              setStartHighlightIndex(null);
              setHover(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              captureEvent("clip", "edit start", {}, personId);
              setStartIndex(index);
              setStartHighlightIndex(null);
            }}
            style={{
              ...styles.wordMenuItem,
              ...(hover === "start" && styles.wordMenuItemHover),
            }}
            data-bf-testid="word-menu-start-here"
          >
            <div style={styles.wordMenuText}>Start here</div>
          </div>
        )}
        {showEnd && (
          <div
            onMouseEnter={() => {
              setEndHighlightIndex(index);
              setHover("end");
            }}
            onMouseLeave={() => {
              setEndHighlightIndex(null);
              setHover(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              captureEvent("clip", "edit end", {}, personId);
              setEndIndex(index);
              setEndHighlightIndex(null);
            }}
            style={{
              ...styles.wordMenuItem,
              ...(hover === "end" && styles.wordMenuItemHover),
            }}
            data-bf-testid="word-menu-end-here"
          >
            <div style={styles.wordMenuText}>End here</div>
          </div>
        )}
        {showTrimEnd && (
          <div
            onMouseEnter={() => setHover("trim")}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              captureEvent("clip", "trim end", {}, personId);
              handleTrimWord();
            }}
            style={{
              ...styles.wordMenuItem,
              ...(hover === "trim" && styles.wordMenuItemHover),
            }}
            data-bf-testid="word-menu-trim-end"
          >
            <div style={styles.wordMenuText}>Trim end</div>
          </div>
        )}
        <div style={styles.separator} />
        {enableWordEditing && (
          <div
            onMouseEnter={() => setHover("edit")}
            onMouseLeave={() => setHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              handleEditWord();
            }}
            style={{
              ...styles.wordMenuItem,
              ...(hover === "edit" && styles.wordMenuItemHover),
            }}
          >
            <div style={styles.wordMenuText}>Edit word...</div>
          </div>
        )}
        <div style={styles.wordMenuArrow} />
      </div>
    </>
  );
}
