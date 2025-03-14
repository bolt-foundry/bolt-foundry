import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { createPortal } from "react-dom";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  KEY_ESCAPE_COMMAND,
  type LexicalCommand,
} from "lexical";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import {
  $createContentFoundryNode,
  type Example,
} from "packages/app/components/lexical/nodes/ContentFoundryNode.tsx";
import Button from "packages/app/components/lexical/ui/Button.tsx";
import Modal from "packages/app/components/lexical/ui/Modal.tsx";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import Placeholder from "packages/app/components/lexical/ui/Placeholder.tsx";
import type { CLEAR_EDITOR_COMMAND, EditorState, LexicalEditor } from "lexical";
import { $rootTextContent } from "@lexical/text";

export const INSERT_EXAMPLE_COMMAND: LexicalCommand<string> = createCommand();

function PlainTextEditor({
  className,
  autoFocus,
  onEscape,
  onChange,
  editorRef,
  placeholder = "Type an example...",
}: {
  autoFocus?: boolean;
  className?: string;
  editorRef?: { current: null | LexicalEditor };
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  onEscape: (e: KeyboardEvent) => boolean;
  placeholder?: string;
}) {
  const initialConfig = {
    namespace: "ContentFoundry",
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: {
      // Simple theme for the example editor
      text: {
        base: "ContentFoundry-EditorTheme__text",
      },
      paragraph: {
        base: "ContentFoundry-EditorTheme__paragraph",
      },
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="ContentFoundry-EditorContainer">
        <PlainTextPlugin
          contentEditable={<ContentEditable className={className} />}
          placeholder={<Placeholder>{placeholder}</Placeholder>}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        {autoFocus !== false && <AutoFocusPlugin />}
        <EscapeHandlerPlugin onEscape={onEscape} />
        <ClearEditorPlugin />
        {editorRef !== undefined && <EditorRefPlugin editorRef={editorRef} />}
      </div>
    </LexicalComposer>
  );
}

function EditorRefPlugin({
  editorRef,
}: {
  editorRef: { current: null | LexicalEditor };
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editorRef.current = editor;
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);

  return null;
}

function EscapeHandlerPlugin({
  onEscape,
}: {
  onEscape: (e: KeyboardEvent) => boolean;
}): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      (event: KeyboardEvent) => {
        return onEscape(event);
      },
      2,
    );
  }, [editor, onEscape]);

  return null;
}

function useOnChange(
  setContent: (text: string) => void,
  setCanSubmit: (canSubmit: boolean) => void,
) {
  return useCallback(
    (editorState: EditorState, _editor: LexicalEditor) => {
      editorState.read(() => {
        setContent($rootTextContent());
        setCanSubmit($rootTextContent().trim().length > 0);
      });
    },
    [setCanSubmit, setContent],
  );
}

function ExampleInputBox({
  editor,
  onClose,
  onSubmit,
}: {
  editor: LexicalEditor;
  onClose: () => void;
  onSubmit: (content: string) => void;
}) {
  const [content, setContent] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<LexicalEditor>(null);

  const onEscape = (event: KeyboardEvent): boolean => {
    event.preventDefault();
    onClose();
    return true;
  };

  const submitExample = () => {
    if (canSubmit) {
      onSubmit(content);
      onClose();
    }
  };

  const onChange = useOnChange(setContent, setCanSubmit);

  return (
    <div className="ContentFoundry-InputBox" ref={boxRef}>
      <h3>Add Example</h3>
      <PlainTextEditor
        className="ContentFoundry-Editor"
        onEscape={onEscape}
        onChange={onChange}
        editorRef={editorRef}
      />
      <div className="ContentFoundry-Buttons">
        <Button
          onClick={onClose}
          className="ContentFoundry-Button"
        >
          Cancel
        </Button>
        <Button
          onClick={submitExample}
          disabled={!canSubmit}
          className="ContentFoundry-Button primary"
        >
          Add Example
        </Button>
      </div>
    </div>
  );
}

function ExamplesPanelList({
  examples,
  deleteExample,
  activeExampleId,
}: {
  examples: Array<Example>;
  deleteExample: (exampleId: string) => void;
  activeExampleId: string | null;
}) {
  const rtf = new Intl.RelativeTimeFormat("en", {
    localeMatcher: "best fit",
    numeric: "auto",
    style: "short",
  });

  return (
    <ul className="ContentFoundry-ExamplesList">
      {examples.map((example) => {
        const seconds = Math.round(
          (example.timeStamp - performance.now()) / 1000,
        );
        const minutes = Math.round(seconds / 60);
        const isActive = activeExampleId === example.id;

        return (
          <li
            key={example.id}
            className={`ContentFoundry-ExampleItem ${isActive ? "active" : ""}`}
          >
            <div className="ContentFoundry-ExampleHeader">
              <span className="ContentFoundry-ExampleAuthor">
                {example.author}
              </span>
              <span className="ContentFoundry-ExampleTime">
                · {seconds > -10 ? "Just now" : rtf.format(minutes, "minute")}
              </span>
              <Button
                onClick={() => deleteExample(example.id)}
                className="ContentFoundry-DeleteButton"
              >
                Delete
              </Button>
            </div>
            <p className="ContentFoundry-ExampleContent">
              {example.content}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function ExamplesPanel({
  examples,
  deleteExample,
  activeExampleId,
}: {
  examples: Array<Example>;
  deleteExample: (exampleId: string) => void;
  activeExampleId: string | null;
}) {
  const isEmpty = examples.length === 0;

  return (
    <div className="ContentFoundry-ExamplesPanel">
      <h2 className="ContentFoundry-ExamplesHeading">Examples</h2>
      {isEmpty
        ? <div className="ContentFoundry-Empty">No Examples</div>
        : (
          <ExamplesPanelList
            examples={examples}
            deleteExample={deleteExample}
            activeExampleId={activeExampleId}
          />
        )}
    </div>
  );
}

export function ContentFoundryPlugin() {
  const [inDom, setInDom] = useState(false);
  const [editor] = useLexicalComposerContext();
  const [showExampleInput, setShowExampleInput] = useState(false);
  const [showExamplesPanel, setShowExamplesPanel] = useState(false);
  const [examples, setExamples] = useState<Array<Example>>([]);
  const [activeExampleId, setActiveExampleId] = useState<string | null>(null);
  const [modal, showModal] = useState<
    {
      title: string;
      content: (onClose: () => void) => React.ReactNode;
    } | null
  >(null);

  useEffect(() => {
    setInDom(true);
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      INSERT_EXAMPLE_COMMAND,
      () => {
        setShowExampleInput(true);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  useEffect(() => {
    // Listen for selection changes to detect when a ContentFoundryNode is selected
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          let contentFoundryNode = null;
          let parent = node.getParent();

          // Check if the node or any of its parents is a ContentFoundryNode
          while (parent) {
            if (parent.getType() === "content-foundry-example") {
              contentFoundryNode = parent;
              break;
            }
            parent = parent.getParent();
          }

          if (contentFoundryNode) {
            // If a ContentFoundryNode is selected, show the examples panel
            setShowExamplesPanel(true);
            const examplesList = contentFoundryNode.getExamples();
            setExamples(examplesList);

            // Set the first example as active if there are examples
            if (examplesList.length > 0 && !activeExampleId) {
              setActiveExampleId(examplesList[0].id);
            }
          } else {
            // Otherwise, reset examples data
            setActiveExampleId(null);
          }
        }
      });
    });
  }, [editor, activeExampleId]);

  const closeExampleInput = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      // Restore selection
      if (selection !== null) {
        selection.dirty = true;
      }
    });
    setShowExampleInput(false);
  }, [editor]);

  const addExample = useCallback(
    (content: string) => {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          // Check if we're inside a ContentFoundryNode
          let foundNode = false;
          const anchor = selection.anchor;
          const anchorNode = anchor.getNode();
          let parent = anchorNode.getParent();

          while (parent) {
            if (parent.getType() === "content-foundry-example") {
              // Add example to existing node
              parent.addExample(content, "User");
              foundNode = true;
              break;
            }
            parent = parent.getParent();
          }

          if (!foundNode) {
            // Create a new ContentFoundryNode
            const contentFoundryNode = $createContentFoundryNode();
            contentFoundryNode.addExample(content, "User");

            $insertNodeToNearestRoot(contentFoundryNode);

            // Add a paragraph after the ContentFoundryNode
            const paragraphNode = $createParagraphNode();
            contentFoundryNode.insertAfter(paragraphNode);
            paragraphNode.select();
          }
        }
      });
    },
    [editor],
  );

  const deleteExample = useCallback(
    (exampleId: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor;
          const anchorNode = anchor.getNode();
          let parent = anchorNode.getParent();

          while (parent) {
            if (parent.getType() === "content-foundry-example") {
              parent.deleteExample(exampleId);

              // Update examples state
              const updatedExamples = parent.getExamples();
              setExamples(updatedExamples);

              // If the active example was deleted, set a new active example
              if (activeExampleId === exampleId) {
                setActiveExampleId(
                  updatedExamples.length > 0 ? updatedExamples[0].id : null,
                );
              }

              break;
            }
            parent = parent.getParent();
          }
        }
      });
    },
    [editor, activeExampleId],
  );

  const onAddExample = useCallback(() => {
    editor.dispatchCommand(INSERT_EXAMPLE_COMMAND, undefined);
  }, [editor]);

  return inDom
    ? (
      <>
        {showExampleInput &&
          createPortal(
            <ExampleInputBox
              editor={editor}
              onClose={closeExampleInput}
              onSubmit={addExample}
            />,
            document.body,
          )}
        {createPortal(
          <Button
            className={`ContentFoundry-ShowExamplesButton ${
              showExamplesPanel ? "active" : ""
            }`}
            onClick={() => setShowExamplesPanel(!showExamplesPanel)}
            title={showExamplesPanel ? "Hide Examples" : "Show Examples"}
          >
            Examples
          </Button>,
          document.body,
        )}
        {!showExampleInput && createPortal(
          <Button
            className="ContentFoundry-AddExampleButton"
            onClick={onAddExample}
            title="Add Example"
          >
            + Example
          </Button>,
          document.body,
        )}
        {showExamplesPanel &&
          createPortal(
            <ExamplesPanel
              examples={examples}
              deleteExample={deleteExample}
              activeExampleId={activeExampleId}
            />,
            document.body,
          )}
        {modal !== null &&
          createPortal(
            <Modal
              onClose={() => showModal(null)}
              title={modal.title}
              closeOnClickOutside={false}
            >
              {modal.content(() => showModal(null))}
            </Modal>,
            document.body,
          )}
      </>
    )
    : null;
}
