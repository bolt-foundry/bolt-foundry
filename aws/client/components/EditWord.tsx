import { graphql, type Maybe, React, ReactRelay } from "aws/client/deps.ts";
import Button from "aws/client/ui_components/Button.tsx";
import Input from "aws/client/ui_components/Input.tsx";
import { DGWord } from "aws/types/transcript.ts";
import useKeyboardInput from "packages/client/hooks/useKeyboardInput.tsx";
import useClickOutside from "aws/client/hooks/useClickOutside.tsx";
import type { VideoPlayerHandles } from "aws/client/components/VideoPlayer.tsx";
const { useMutation } = ReactRelay;

const styles: Record<string, React.CSSProperties> = {
  input: {
    margin: 8,
    textAlign: "center",
    padding: 8,
    fontSize: "1.2em",
  },
  word: {
    fontWeight: "bold",
    color: "var(--textAccent)",
  },
  playBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
};

const editWordMutation = await graphql`
  mutation EditWordMutation($id: ID!, $punctuated_word: String!, $start: Float!, $word: String!) {
    updateTranscriptWord(id: $id, punctuated_word: $punctuated_word, start: $start, word: $word) {
      id
      words
      transcriptText
    }
  }
`;

type Props = {
  onClose: () => void;
  word: DGWord;
  singleEdit?: boolean;
  transcriptId: Maybe<string>;
  updateWord: (word: DGWord) => void;
  videoPlayerRef: React.RefObject<VideoPlayerHandles>;
  videoPlayerIsPlaying: boolean;
};

export default function EditWord(
  {
    onClose,
    word,
    singleEdit,
    transcriptId,
    updateWord,
    videoPlayerRef,
    videoPlayerIsPlaying,
  }: Props,
) {
  const [newWord, setNewWord] = React.useState<string>(
    word.punctuated_word,
  );
  const [shouldLoop, setShouldLoop] = React.useState<boolean>(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [commit, isInFlight] = useMutation(editWordMutation);

  useClickOutside(menuRef, onClose, {
    isActive: true,
    showConfirmation: newWord !== word.punctuated_word,
  });

  useKeyboardInput({
    keybindings: {
      "escape": onClose,
      "enter": () => handleSubmitWord(),
    },
  });

  const handleChangeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewWord(e.target.value);
  };

  const handleSubmitWord = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const unpunctuatedWord = newWord.replace(
      /[.,\/#!$%\^&\*;:{}=\-_`~()\[\]'"?<>\\]/g,
      "",
    );
    if (!singleEdit) {
      updateWord({
        ...word,
        punctuated_word: newWord,
        word: unpunctuatedWord,
      });
      onClose();
      return;
    }
    commit({
      variables: {
        id: transcriptId,
        punctuated_word: newWord,
        start: word.start,
        word: unpunctuatedWord,
      },
      optimisticResponse: {
        updateTranscriptWord: {
          id: transcriptId,
          words: "",
          transcriptText: "",
        },
      },
    });
  };

  if (!transcriptId) {
    return (
      <div className="miniModalBackground">
        <div className="miniModal">
          <div>
            Missing transcript
          </div>
          <Button kind="outline" onClick={onClose} text="Close" />
        </div>
      </div>
    );
  }

  return (
    <div className="miniModalBackground">
      <div className="miniModal" ref={menuRef}>
        <div>
          Change <span style={styles.word}>{word.punctuated_word}</span> to
        </div>
        <form onSubmit={handleSubmitWord}>
          <Input
            onChange={handleChangeWord}
            placeholder="New word"
            style={styles.input}
            type="text"
            value={newWord}
            autoFocus={true}
            autoSelect={true}
          />
          <div className="miniModalButtons">
            <Button kind="outline" onClick={onClose} text="Cancel" />
            <Button
              kind="primary"
              type="submit"
              text="Save word"
            />
          </div>
        </form>
        <div style={styles.playBar}>
          {videoPlayerIsPlaying
            ? (
              <Button
                kind="outline"
                iconLeft="pause"
                onClick={() => {
                  videoPlayerRef.current?.pause();
                }}
                size="small"
              />
            )
            : (
              <Button
                kind="outline"
                iconLeft="play"
                onClick={() => {
                  videoPlayerRef.current?.playAroundWord(
                    word.start,
                    word.end,
                  );
                }}
                size="small"
              />
            )}
          <div>Listen</div>
        </div>
      </div>
    </div>
  );
}
