import {
  GQLSubConfigOperationType,
  graphql,
  React,
  ReactRelay,
} from "aws/client/deps.ts";
import { ManualCrop } from "aws/client/components/ManualCropMenu.tsx";
import { useClipEditData_clip$key } from "aws/__generated__/useClipEditData_clip.graphql.ts";
import { DGWord } from "aws/types/transcript.ts";
const { useState, useEffect, useMemo, useReducer } = React;
const { useFragment } = ReactRelay;

const EXTRA_WORDS = 20;

type WordType = {
  item: DGWord;
  index: number;
};

function sliceWithIndex(
  items: Array<DGWord>,
  startIndex: number,
  endIndex: number = items.length,
): Array<WordType> {
  return items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: index + startIndex,
  }));
}

export enum ActionType {
  SET_START_INDEX = "SET_START_INDEX",
  SET_END_INDEX = "SET_END_INDEX",
  SET_END_TIME_OVERRIDE = "SET_END_TIME_OVERRIDE",
  SET_HIGHLIGHT_START_INDEX = "SET_HIGHLIGHT_START_INDEX",
  SET_HIGHLIGHT_END_INDEX = "SET_HIGHLIGHT_END_INDEX",
  SET_EDITABLE_TEXT = "SET_EDITABLE_TEXT",
  SET_EDITABLE_TEXT_PRE = "SET_EDITABLE_TEXT_PRE",
  SET_EDITABLE_TEXT_POST = "SET_EDITABLE_TEXT_POST",
  SET_WORD_TO_UPDATE = "SET_WORD_TO_UPDATE",
  SET_TITLE = "SET_TITLE",
  SET_MANUAL_CROP = "SET_MANUAL_CROP",
  SET_MANUAL_CROP_ACTIVE = "SET_MANUAL_CROP_ACTIVE",
}

export type ClipReducerState = {
  startIndex: number;
  endIndex: number;
  endTimeOverride: number | null;
  highlightStartIndex: number | null;
  highlightEndIndex: number | null;
  editableText: Array<WordType> | null;
  editableTextPre: number;
  editableTextPost: number;
  wordsToUpdate: Array<DGWord>;
  title: string;
  manualCrop: Array<ManualCrop>;
  manualCropActive: boolean;
};

export type ClipReducerAction =
  | { type: ActionType.SET_START_INDEX; payload: number }
  | { type: ActionType.SET_END_INDEX; payload: number }
  | { type: ActionType.SET_END_TIME_OVERRIDE; payload: number }
  | { type: ActionType.SET_HIGHLIGHT_START_INDEX; payload: number | null }
  | { type: ActionType.SET_HIGHLIGHT_END_INDEX; payload: number | null }
  | { type: ActionType.SET_EDITABLE_TEXT; payload: Array<WordType> | null }
  | { type: ActionType.SET_EDITABLE_TEXT_PRE; payload: number }
  | { type: ActionType.SET_EDITABLE_TEXT_POST; payload: number }
  | { type: ActionType.SET_WORD_TO_UPDATE; payload: DGWord }
  | { type: ActionType.SET_TITLE; payload: string }
  | { type: ActionType.SET_MANUAL_CROP; payload: Array<ManualCrop> }
  | { type: ActionType.SET_MANUAL_CROP_ACTIVE; payload: boolean };

const fragment = await graphql`
  fragment useClipEditData_clip on Clip {
    ...StarClipButton_clip
    ...ChangeRequestButton_clip
    ...ManualCropMenu_clip
    id
    description
    downloadUrl
    encodingStatus
    end_index
    end_time
    endTimeOverride
    start_index
    start_time
    text
    title
    manualCrop
    manualCropActive
    ...DownloadClip_clip
  }
`;

const subscriptionFragment = await graphql`
  subscription useClipEditDataSubscription($id: ID!) {
    clip(id: $id) {
      ...useClipEditData_clip
    }
  }
`;

const clipReducer = (
  state: ClipReducerState,
  action: ClipReducerAction,
): ClipReducerState => {
  switch (action.type) {
    case ActionType.SET_START_INDEX:
      return { ...state, startIndex: action.payload };
    case ActionType.SET_END_INDEX:
      return { ...state, endIndex: action.payload };
    case ActionType.SET_END_TIME_OVERRIDE:
      return { ...state, endTimeOverride: action.payload };
    case ActionType.SET_HIGHLIGHT_START_INDEX:
      return { ...state, highlightStartIndex: action.payload };
    case ActionType.SET_HIGHLIGHT_END_INDEX:
      return { ...state, highlightEndIndex: action.payload };
    case ActionType.SET_EDITABLE_TEXT:
      return { ...state, editableText: action.payload };
    case ActionType.SET_EDITABLE_TEXT_PRE:
      return { ...state, editableTextPre: action.payload };
    case ActionType.SET_EDITABLE_TEXT_POST:
      return { ...state, editableTextPost: action.payload };
    case ActionType.SET_WORD_TO_UPDATE: {
      const word = action.payload as DGWord;
      const wordIndexIfExists = state.wordsToUpdate.findIndex(
        (w) => w.start === word.start,
      );
      const newWords = [...state.wordsToUpdate];
      if (wordIndexIfExists > -1) {
        newWords[wordIndexIfExists] = word;
      } else {
        newWords.push(word);
      }
      return { ...state, wordsToUpdate: newWords };
    }
    case ActionType.SET_TITLE:
      return { ...state, title: action.payload };
    case ActionType.SET_MANUAL_CROP: {
      return { ...state, manualCrop: action.payload, manualCropActive: true };
    }
    case ActionType.SET_MANUAL_CROP_ACTIVE: {
      return { ...state, manualCropActive: action.payload };
    }
    default:
      return state;
  }
};

export function useClipEditData(
  clip$key: useClipEditData_clip$key,
  transcriptWords?: Array<DGWord>,
) {
  const data = useFragment(fragment, clip$key);
  const subscriptionConfig: GQLSubConfigOperationType = useMemo(
    () => ({
      variables: { id: data.id },
      subscription: subscriptionFragment,
      updater: (store) => {
        const newClip = store.getRootField("clip");
        store.getRoot().setLinkedRecord(newClip, "clip", {
          id: data.id,
        });
      },
    }),
    [data.id],
  );
  ReactRelay.useSubscription(subscriptionConfig);

  const initialState = {
    startIndex: data.start_index ?? 0,
    endIndex: data.end_index ?? 0,
    endTimeOverride: null,
    highlightStartIndex: null,
    highlightEndIndex: null,
    editableText: null,
    editableTextPre: EXTRA_WORDS,
    editableTextPost: EXTRA_WORDS,
    wordsToUpdate: [],
    title: data.title ?? "",
    manualCrop: data.manualCrop ? JSON.parse(data.manualCrop) : [],
    manualCropActive: !!data.manualCropActive,
  };

  const [state, dispatch] = useReducer(clipReducer, initialState);
  const [draftClip, setDraftClip] = useState(data);

  useEffect(() => {
    if (transcriptWords && transcriptWords.length > 0) {
      const startItem = transcriptWords[state.startIndex];
      const endItem = transcriptWords[state.endIndex];
      const newStartTime = startItem?.start ?? 0;
      const newEndTime = endItem?.end ?? 0;

      const itemsForText = sliceWithIndex(
        transcriptWords,
        state.startIndex,
        state.endIndex + 1,
      );
      const text = itemsForText.map((item) => {
        if (item == null || item.item == null) return;
        const draftWord = state.wordsToUpdate.find((w) =>
          w.start === item.item.start
        );
        if (draftWord) {
          return draftWord.punctuated_word;
        }
        return item.item.punctuated_word;
      }).join(" ");

      let newStartIndex = state.startIndex - state.editableTextPre;
      if (newStartIndex < 0) {
        newStartIndex = 0;
      }
      let newEndIndex = state.endIndex + state.editableTextPost;
      if (newEndIndex > transcriptWords.length) {
        newEndIndex = transcriptWords.length;
      }
      const itemsOfInterest = sliceWithIndex(
        transcriptWords,
        newStartIndex,
        newEndIndex,
      );
      dispatch({
        type: ActionType.SET_EDITABLE_TEXT,
        payload: itemsOfInterest,
      });
      setDraftClip({
        ...draftClip,
        text,
        start_index: state.startIndex,
        end_index: state.endIndex,
        start_time: Number(newStartTime ?? draftClip?.start_time),
        end_time: Number(newEndTime ?? draftClip?.end_time),
        endTimeOverride: state.endTimeOverride,
        title: state.title,
      });
    }
  }, [
    state.wordsToUpdate,
    transcriptWords,
    state.startIndex,
    state.endIndex,
    state.editableTextPre,
    state.editableTextPost,
    state.title,
    state.endTimeOverride,
  ]);

  return { data, dispatch, draftClip, state };
}
