import {React} from "aws/client/deps.ts";
import classnames from "/aws/client/lib/classnames.ts";
import WordMenu from "/aws/client/components/WordMenu.tsx";
import { useClipContext } from "/aws/client/contexts/ClipContext.tsx";
import { ActionType, ClipReducerAction, ClipReducerState } from "/aws/client/hooks/useClipEditData.tsx";
import { WordData } from "/aws/client/components/ClipEdit.tsx";

type Props = {
  endTimeOverride: number | null;
  wordData: WordData;
  state: ClipReducerState;
  dispatch: React.Dispatch<ClipReducerAction>;
  goto: (time: number) => void;
}

export default function TextModeWord({
  endTimeOverride,
  wordData, 
  state,
  dispatch,
  goto,
}: Props) {
  const {
    editingWord,
    setEditingWord,
    selectedWordIndex,
    setSelectedWordIndex,
    setTrimmingWord,
  } = useClipContext();

  const {
    index,
    word,
    renderedWord,
    isCurrentWord,
    isExtraText,
    isHighlighted,
    nextStart
  } = wordData;

  const handleWordClick = (index: number | null) => {
    // if first word, add more words to the beginning
    if (index === state.editableText?.[0].index) {
      dispatch({
        type: ActionType.SET_EDITABLE_TEXT_PRE,
        payload: state.editableTextPre + 10,
      });
    }
    // if last word, add more words to the end
    if (index === state.editableText?.[state.editableText.length - 1].index) {
      dispatch({
        type: ActionType.SET_EDITABLE_TEXT_POST,
        payload: state.editableTextPost + 10,
      });
    }
    if (selectedWordIndex != null && selectedWordIndex === index) {
      setSelectedWordIndex(null);
      return;
    }
    setSelectedWordIndex(index);
    const gotoTime = state.editableText?.find((x) => x.index === index)?.item
      ?.start;
    if (gotoTime) goto(gotoTime);
  };

  const handleEditWord = () => {
    setEditingWord(word);
  };

  const menuOpen = selectedWordIndex === index;
  return <span
    key={index}
    className={classnames([
      "clipWord",
      { clipWordLight: isExtraText },
      { clipHighlight: isHighlighted || menuOpen },
      { clipCurrentWord: isCurrentWord },
    ])}
    onClick={() => handleWordClick(index)}
    onDoubleClick={() => {
      handleWordClick(index);
      handleEditWord();
    }}
  >
    {renderedWord}
    {menuOpen && (
      <WordMenu
        index={index}
        startIndex={state.startIndex}
        endIndex={state.endIndex}
        editingWord={editingWord}
        handleWordClick={() => handleWordClick(null)}
        setStartIndex={(i: number) => {
          dispatch({
            type: ActionType.SET_START_INDEX,
            payload: i,
          });
          setSelectedWordIndex(null);
        }}
        setEndIndex={(i: number) => {
          dispatch({
            type: ActionType.SET_END_INDEX,
            payload: i,
          });
          setSelectedWordIndex(null);
        }}
        setStartHighlightIndex={(i: number | null) =>
          dispatch({
            type: ActionType.SET_HIGHLIGHT_START_INDEX,
            payload: i,
          })}
        setEndHighlightIndex={(i: number | null) =>
          dispatch({
            type: ActionType.SET_HIGHLIGHT_END_INDEX,
            payload: i,
          })}
        handleEditWord={() => {
          handleEditWord();
          setSelectedWordIndex(null);
        }}
        handleTrimWord={() => {
          setTrimmingWord({
            currentValue: endTimeOverride,
            startTime: word.start,
            endTime: nextStart,
          });
        }}
      />
    )}
  </span>
}