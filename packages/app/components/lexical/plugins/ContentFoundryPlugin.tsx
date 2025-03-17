/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  EditorState,
  LexicalCommand,
  LexicalEditor,
  NodeKey,
} from "lexical";

import {
  $createMarkNode,
  $getMarkIDs,
  $isMarkNode,
  $unwrapMarkNode,
  $wrapSelectionInMarkNode,
  MarkNode,
} from "@lexical/mark";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { createDOMRange, createRectsFromDOMRange } from "@lexical/selection";
import { $isRootTextContentEmpty, $rootTextContent } from "@lexical/text";
import { mergeRegister, registerNestedElementResolver } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  KEY_ESCAPE_COMMAND,
} from "lexical";
import {
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import useLayoutEffect from "packages/app/components/lexical/hooks/useLayoutEffect.tsx";

import {
  createExample,
  createThread,
  type Example,
  type Examples,
  ExampleStore,
  type Thread,
  useExampleStore,
} from "packages/app/components/lexical/plugins/ContentFoundry.ts";
import useModal from "packages/app/components/lexical/hooks/useModal.tsx";
import ExampleEditorTheme from "packages/app/components/lexical/themes/ExampleEditorTheme.ts";
import Button from "packages/app/components/lexical/ui/Button.tsx";
import ContentEditable from "packages/app/components/lexical/ui/ContentEditable.tsx";
import Placeholder from "packages/app/components/lexical/ui/Placeholder.tsx";
import { getLogger } from "packages/logger.ts";
import { BfDsButton } from "packages/bfDs/components/BfDsButton.tsx";
import { classnames } from "lib/classnames.ts";
import {
  BfDsIcon,
  type BfDsIconType,
} from "packages/bfDs/components/BfDsIcon.tsx";
const logger = getLogger(import.meta);

export const INSERT_INLINE_COMMAND: LexicalCommand<void> = createCommand();

function AddExampleBox({
  editor,
  onAddExample,
}: {
  editor: LexicalEditor;
  onAddExample: () => void;
}): JSX.Element {
  const boxRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const boxElem = boxRef.current;
    const selection = globalThis.getSelection();

    if (boxElem !== null && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      boxElem.style.left = `${rect.right + 2}px`;
      boxElem.style.top = `${rect.top - 10}px`;
    }
  }, []);

  useEffect(() => {
    globalThis.addEventListener("resize", updatePosition);

    return () => {
      globalThis.removeEventListener("resize", updatePosition);
    };
  }, [editor, updatePosition]);

  useLayoutEffect(() => {
    updatePosition();
  }, [editor, updatePosition]);

  return (
    <div className="ContentFoundryPlugin_AddExampleBox" ref={boxRef}>
      <BfDsButton
        shadow
        kind="filledSuccess"
        iconLeft="plus"
        onClick={onAddExample}
      />
    </div>
  );
}

function EditorRefPlugin({
  editorRef,
}: {
  editorRef: { current: null | LexicalEditor };
}): null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
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
    namespace: "Exampling",
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: ExampleEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="ContentFoundryPlugin_ExampleInputBox_EditorContainer">
        <PlainTextPlugin
          contentEditable={<ContentEditable className={className} />}
          ErrorBoundary={() => <div>An error occurred.</div>}
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

function useOnChange(
  setContent: (text: string) => void,
  setCanSubmit: (canSubmit: boolean) => void,
) {
  return useCallback(
    (editorState: EditorState, _editor: LexicalEditor) => {
      editorState.read(() => {
        setContent($rootTextContent());
        setCanSubmit(!$isRootTextContentEmpty(_editor.isComposing(), true));
      });
    },
    [setCanSubmit, setContent],
  );
}

function Rating({ value, onChange, xclass = "" }: {
  value: number;
  onChange: (rating: number) => void;
  xclass?: string;
}) {
  const getButtonSettings = useCallback((level: number) => {
    let mixNumber;
    switch (level) {
      case -2:
        mixNumber = "080";
        break;
      case -1:
        mixNumber = "060";
        break;
      case 1:
        mixNumber = "040";
        break;
      case 2:
        mixNumber = "020";
        break;
      default:
        break;
    }
    if (value === level) {
      return {
        backgroundColor: `var(--primaryMix${mixNumber}Alert)`,
        backgroundColorHover: `var(--primaryMix${mixNumber}AlertHover)`,
        borderColor: `var(--primaryMix${mixNumber}Alert)`,
        borderColorHover: `var(--primaryMix${mixNumber}AlertHover)`,
        color: "var(--textOnAlert)",
      };
    }
    return {
      backgroundColor: "var(--background)",
      backgroundColorHover: "var(--outlineHover)",
      color: `var(--primaryMix${mixNumber}Alert)`,
      colorHover: `var(--primaryMix${mixNumber}AlertHover)`,
      borderColor: "var(--background)",
      borderColorHover: `var(--primaryMix${mixNumber}AlertHover)`,
    };
  }, [value]);

  return (
    <div className={`flex1 flexRow mediumGap ${xclass}`}>
      <BfDsButton
        kind={value === -3 ? "filledAlert" : "outlineAlert"}
        iconLeft="starSolid"
        onClick={() => onChange(-3)}
        size="medium"
      />
      <BfDsButton
        kind="custom"
        customSettings={getButtonSettings(-2)}
        iconLeft="star2ThirdNegative"
        onClick={() => onChange(-2)}
        size="medium"
      />
      <BfDsButton
        kind="custom"
        customSettings={getButtonSettings(-1)}
        iconLeft="star1ThirdNegative"
        onClick={() => onChange(-1)}
        size="medium"
      />
      <BfDsButton
        kind="custom"
        customSettings={getButtonSettings(1)}
        iconLeft="star1ThirdPositive"
        onClick={() => onChange(1)}
        size="medium"
      />
      <BfDsButton
        kind="custom"
        customSettings={getButtonSettings(2)}
        iconLeft="star2ThirdPositive"
        onClick={() => onChange(2)}
        size="medium"
      />
      <BfDsButton
        kind={value === 3 ? "filledPrimaryLight" : "outlinePrimary"}
        iconLeft="starSolid"
        onClick={() => onChange(3)}
        size="medium"
      />
    </div>
  );
}

function ExampleInputBox({
  editor,
  cancelAddExample,
  submitAddExample,
}: {
  cancelAddExample: () => void;
  editor: LexicalEditor;
  submitAddExample: (
    exampleOrThread: Example | Thread,
    isInlineExample: boolean,
  ) => void;
}) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(3);
  const [canSubmit, setCanSubmit] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const selectionState = useMemo(
    () => ({
      container: document.createElement("div"),
      elements: [],
    }),
    [],
  );

  const updateLocation = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const anchorNode = anchor.getNode();
        const focusNode = focus.getNode();
        const range = createDOMRange(
          editor,
          anchorNode,
          anchor.offset,
          focusNode,
          focus.offset,
        );
        const boxElem = boxRef.current;
        if (range !== null && boxElem !== null) {
          const { left, bottom, width } = range.getBoundingClientRect();
          const selectionRects = createRectsFromDOMRange(editor, range);
          let correctedLeft = selectionRects.length === 1
            ? left + width / 2 - 125
            : left - 125;
          if (correctedLeft < 10) {
            correctedLeft = 10;
          }
          boxElem.style.left = `${correctedLeft}px`;
          boxElem.style.top = `${bottom + 20}px`;
          const selectionRectsLength = selectionRects.length;
          const { container } = selectionState;
          const elements: Array<HTMLSpanElement> = selectionState.elements;
          const elementsLength = elements.length;

          for (let i = 0; i < selectionRectsLength; i++) {
            const selectionRect = selectionRects[i];
            let elem: HTMLSpanElement = elements[i];
            if (elem === undefined) {
              elem = document.createElement("span");
              elements[i] = elem;
              container.appendChild(elem);
            }
            const color = "255, 212, 0";
            const style =
              `position:absolute;top:${selectionRect.top}px;left:${selectionRect.left}px;height:${selectionRect.height}px;width:${selectionRect.width}px;background-color:rgba(${color}, 0.3);pointer-events:none;z-index:5;`;
            elem.style.cssText = style;
          }
          for (let i = elementsLength - 1; i >= selectionRectsLength; i--) {
            const elem = elements[i];
            container.removeChild(elem);
            elements.pop();
          }
        }
      }
    });
  }, [editor, selectionState]);

  useLayoutEffect(() => {
    updateLocation();
    const container = selectionState.container;
    const body = document.body;
    if (body !== null) {
      body.appendChild(container);
      return () => {
        body.removeChild(container);
      };
    }
  }, [selectionState.container, updateLocation]);

  useEffect(() => {
    globalThis.addEventListener("resize", updateLocation);

    return () => {
      globalThis.removeEventListener("resize", updateLocation);
    };
  }, [updateLocation]);

  const onEscape = (event: KeyboardEvent): boolean => {
    event.preventDefault();
    cancelAddExample();
    return true;
  };

  const submitExample = () => {
    if (canSubmit) {
      let quote = editor.getEditorState().read(() => {
        const selection = $getSelection();
        return selection !== null ? selection.getTextContent() : "";
      });
      if (quote.length > 100) {
        quote = quote.slice(0, 99) + "…";
      }
      submitAddExample(
        createThread(quote, [createExample(content, rating, "{AUTHOR NAME}")]),
        true,
      );
    }
  };

  const onChange = useOnChange(setContent, setCanSubmit);

  return (
    <div className="ContentFoundryPlugin_ExampleInputBox" ref={boxRef}>
      <PlainTextEditor
        className="ContentFoundryPlugin_ExampleInputBox_Editor"
        onEscape={onEscape}
        onChange={onChange}
      />
      <Rating
        value={rating}
        onChange={setRating}
        xclass="justifyContentCenter"
      />
      <div className="flexRow gapMedium ContentFoundryPlugin_ExampleInputBox_Buttons">
        <div className="flex1">
          <BfDsButton
            kind="outline"
            onClick={cancelAddExample}
            text="Cancel"
          />
        </div>
        <BfDsButton
          iconLeft="plus"
          onClick={submitExample}
          disabled={!canSubmit}
          text="Example"
        />
      </div>
    </div>
  );
}

function ExamplesComposer({
  submitAddExample,
  thread,
  placeholder,
}: {
  placeholder?: string;
  submitAddExample: (
    exampleOrThread: Example,
    isInlineExample: boolean,
    // eslint-disable-next-line no-shadow
    thread?: Thread,
  ) => void;
  thread?: Thread;
}) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(3);
  const [canSubmit, setCanSubmit] = useState(false);
  const editorRef = useRef<LexicalEditor>(null);

  const onChange = useOnChange(setContent, setCanSubmit);

  const submitExample = () => {
    if (canSubmit) {
      submitAddExample(
        createExample(content, rating, "{AUTHOR NAME}"),
        false,
        thread,
      );
      const editor = editorRef.current;
      if (editor !== null) {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      }
    }
  };

  return (
    <>
      <PlainTextEditor
        className="ContentFoundryPlugin_ExamplesPanel_Editor"
        autoFocus={false}
        onEscape={() => {
          return true;
        }}
        onChange={onChange}
        editorRef={editorRef}
        placeholder={placeholder}
      />
      <div className="flexRow mediumGap alignItemsCenter">
        <Rating value={rating} onChange={setRating} />
        <BfDsButton
          kind="secondary"
          text="Submit"
          disabled={!canSubmit}
          onClick={submitExample}
        />
      </div>
    </>
  );
}

function ShowDeleteExampleOrThreadDialog({
  exampleOrThread,
  deleteExampleOrThread,
  onClose,
  thread = undefined,
}: {
  exampleOrThread: Example | Thread;

  deleteExampleOrThread: (
    example: Example | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread,
  ) => void;
  onClose: () => void;
  thread?: Thread;
}): JSX.Element {
  return (
    <>
      Are you sure you want to delete this {exampleOrThread.type}?
      <div className="Modal__content">
        <Button
          onClick={() => {
            deleteExampleOrThread(exampleOrThread, thread);
            onClose();
          }}
        >
          Delete
        </Button>{" "}
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}

function ExamplesPanelListExample({
  example,
  deleteExample,
  thread,
}: {
  example: Example;
  deleteExample: (
    exampleOrThread: Example | Thread,
    // eslint-disable-next-line no-shadow
    thread?: Thread,
  ) => void;
  thread?: Thread;
}): JSX.Element | null {
  const [modal, showModal] = useModal();
  if (example.deleted) return null;

  logger.info("Showing example", example);

  let starIcon = "starSolid";
  let backgroundColor = "var(--background)";
  let starBgColor = "var(--border)";
  switch (example.rating) {
    case -3:
      backgroundColor = "var(--alert015)";
      starBgColor = "var(--alert)";
      break;
    case -2:
      starIcon = "star2ThirdNegative";
      backgroundColor = "var(--primaryMix080Alert015)";
      starBgColor = "var(--primaryMix080Alert)";
      break;
    case -1:
      starIcon = "star1ThirdNegative";
      backgroundColor = "var(--primaryMix060Alert015)";
      starBgColor = "var(--primaryMix060Alert)";
      break;
    case 1:
      starIcon = "star1ThirdPositive";
      backgroundColor = "var(--primaryMix040Alert015)";
      starBgColor = "var(--primaryMix040Alert)";
      break;
    case 2:
      starIcon = "star2ThirdPositive";
      backgroundColor = "var(--primaryMix020Alert015)";
      starBgColor = "var(--primaryMix020Alert)";
      break;
    case 3:
      backgroundColor = "var(--primaryColor015)";
      starBgColor = "var(--primaryColor)";
      break;
    default:
      break;
  }

  return (
    <li
      className="flexRow gapMedium alignItemsCenter ContentFoundryPlugin_ExamplesPanel_List_Example"
      style={{ backgroundColor }}
    >
      <div
        className="star flexRow flexCenter"
        style={{ backgroundColor: starBgColor }}
      >
        <BfDsIcon
          color="var(--background)"
          name={starIcon as BfDsIconType}
          size={12}
        />
      </div>
      <div className="flex1 ContentFoundryPlugin_ExamplesPanel_List_Details">
        {example.content}
      </div>
      {!example.deleted && (
        <>
          <BfDsButton
            iconLeft="trash"
            kind="overlayAlert"
            onClick={() => {
              showModal(
                "Delete Example",
                (onClose) => (
                  <ShowDeleteExampleOrThreadDialog
                    exampleOrThread={example}
                    deleteExampleOrThread={deleteExample}
                    thread={thread}
                    onClose={onClose}
                  />
                ),
              );
            }}
            size="medium"
          />
          {modal}
        </>
      )}
    </li>
  );
}

function ExamplesPanelList({
  activeIDs,
  examples,
  deleteExampleOrThread,
  submitAddExample,
  markNodeMap,
}: {
  activeIDs: Array<string>;
  examples: Examples;
  deleteExampleOrThread: (
    exampleOrThread: Example | Thread,
    thread?: Thread,
  ) => void;
  markNodeMap: Map<string, Set<NodeKey>>;
  submitAddExample: (
    exampleOrThread: Example | Thread,
    isInlineExample: boolean,
    thread?: Thread,
  ) => void;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [counter, setCounter] = useState(0);
  const [modal, showModal] = useModal();

  useEffect(() => {
    // Used to keep the time stamp up to date
    const id = setTimeout(() => {
      setCounter(counter + 1);
    }, 10000);

    return () => {
      clearTimeout(id);
    };
  }, [counter]);

  return (
    <ul className="ContentFoundryPlugin_ExamplesPanel_List">
      {examples.map((exampleOrThread) => {
        const id = exampleOrThread.id;
        if (exampleOrThread.type === "thread") {
          const handleClickThread = () => {
            const markNodeKeys = markNodeMap.get(id);
            if (
              markNodeKeys !== undefined &&
              (activeIDs === null || activeIDs.indexOf(id) === -1)
            ) {
              const activeElement = document.activeElement;
              // Move selection to the start of the mark, so that we
              // update the UI with the selected thread.
              editor.update(
                () => {
                  const markNodeKey = Array.from(markNodeKeys)[0];
                  const markNode = $getNodeByKey<MarkNode>(markNodeKey);
                  if ($isMarkNode(markNode)) {
                    markNode.selectStart();
                  }
                },
                {
                  onUpdate() {
                    // Restore selection to the previous element
                    if (activeElement !== null) {
                      (activeElement as HTMLElement).focus();
                    }
                  },
                },
              );
            }
          };

          const liClasses = classnames([
            "ContentFoundryPlugin_ExamplesPanel_List_Thread",
            {
              active: activeIDs.indexOf(id) > -1,
            },
          ]);
          const quoteClasses = classnames([
            "ContentFoundryPlugin_ExamplesPanel_List_Thread_QuoteBox",
            "flexRow",
            "gapMedium",
            "alignItemsCenter",
          ]);

          return (
            <li
              key={id}
              onClick={handleClickThread}
              className={liClasses}
            >
              <div className={quoteClasses}>
                <blockquote className="flex1 ContentFoundryPlugin_ExamplesPanel_List_Thread_Quote">
                  <BfDsIcon
                    color="var(--textSecondary)"
                    name="arrowRight"
                    size={12}
                  />
                  <span>{exampleOrThread.quote}</span>
                </blockquote>
                <BfDsButton
                  iconLeft="trash"
                  kind="overlayAlert"
                  onClick={() => {
                    showModal(
                      "Delete Thread",
                      (onClose) => (
                        <ShowDeleteExampleOrThreadDialog
                          exampleOrThread={exampleOrThread}
                          deleteExampleOrThread={deleteExampleOrThread}
                          onClose={onClose}
                        />
                      ),
                    );
                  }}
                  size="medium"
                />
                {modal}
              </div>
              <ul className="ContentFoundryPlugin_ExamplesPanel_List_Thread_Examples">
                {exampleOrThread.examples.map((example) => (
                  <ExamplesPanelListExample
                    key={example.id}
                    example={example}
                    deleteExample={deleteExampleOrThread}
                    thread={exampleOrThread}
                  />
                ))}
              </ul>
              <div className="ContentFoundryPlugin_ExamplesPanel_List_Thread_Editor">
                <ExamplesComposer
                  submitAddExample={submitAddExample}
                  thread={exampleOrThread}
                  placeholder="Add a new example..."
                />
              </div>
            </li>
          );
        }
        return (
          <ExamplesPanelListExample
            key={id}
            example={exampleOrThread}
            deleteExample={deleteExampleOrThread}
          />
        );
      })}
    </ul>
  );
}

export function ContentFoundryPlugin(): JSX.Element {
  const [isInDom, setIsInDom] = useState(false);
  const [editor] = useLexicalComposerContext();
  const exampleStore = useMemo(() => new ExampleStore(editor), [editor]);
  const examples = useExampleStore(exampleStore);
  const markNodeMap = useMemo<Map<string, Set<NodeKey>>>(() => {
    return new Map();
  }, []);
  const [activeIDs, setActiveIDs] = useState<Array<string>>([]);
  const [showExampleInput, setShowExampleInput] = useState(false);
  const [showAddBox, setShowAddBox] = useState(false);
  const selectionTimeout = useRef<number | null>(null);

  useEffect(() => {
    setIsInDom(true);

    const handleSelection = () => {
      if (selectionTimeout.current) {
        clearTimeout(selectionTimeout.current);
      }

      selectionTimeout.current = setTimeout(() => {
        const selection = globalThis.getSelection();
        if (selection && selection.toString().trim()) {
          setShowAddBox(true);
        } else {
          setShowAddBox(false);
        }
      }, 200) as unknown as number;
    };

    document.addEventListener("mouseup", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      if (selectionTimeout.current) {
        clearTimeout(selectionTimeout.current);
      }
    };
  }, []);

  const cancelAddExample = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      // Restore selection
      if (selection !== null) {
        selection.dirty = true;
      }
    });
    setShowExampleInput(false);
  }, [editor]);

  const deleteExampleOrThread = useCallback(
    (example: Example | Thread, thread?: Thread) => {
      if (example.type === "example") {
        const deletionInfo = exampleStore.deleteExampleOrThread(
          example,
          thread,
        );
        if (!deletionInfo) return;
        const { markedExample, index } = deletionInfo;
        exampleStore.addExample(markedExample, thread, index);
      } else {
        exampleStore.deleteExampleOrThread(example);
        // Remove ids from associated marks
        const id = thread !== undefined ? thread.id : example.id;
        const markNodeKeys = markNodeMap.get(id);
        if (markNodeKeys !== undefined) {
          // Do async to avoid causing a React infinite loop
          setTimeout(() => {
            editor.update(() => {
              for (const key of markNodeKeys) {
                const node: null | MarkNode = $getNodeByKey(key);
                if ($isMarkNode(node)) {
                  node.deleteID(id);
                  if (node.getIDs().length === 0) {
                    $unwrapMarkNode(node);
                  }
                }
              }
            });
          });
        }
      }
    },
    [exampleStore, editor, markNodeMap],
  );

  const submitAddExample = useCallback(
    (
      exampleOrThread: Example | Thread,
      isInlineExample: boolean,
      thread?: Thread,
    ) => {
      exampleStore.addExample(exampleOrThread, thread);
      if (isInlineExample) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const focus = selection.focus;
            const anchor = selection.anchor;
            const isBackward = selection.isBackward();
            const id = exampleOrThread.id;

            // Wrap content in a MarkNode
            $wrapSelectionInMarkNode(selection, isBackward, id);

            // Make selection collapsed at the end
            if (isBackward) {
              focus.set(anchor.key, anchor.offset, anchor.type);
            } else {
              anchor.set(focus.key, focus.offset, focus.type);
            }
          }
        });
        setShowExampleInput(false);
      }
    },
    [exampleStore, editor],
  );

  useEffect(() => {
    const changedElems: Array<HTMLElement> = [];
    for (let i = 0; i < activeIDs.length; i++) {
      const id = activeIDs[i];
      const keys = markNodeMap.get(id);
      if (keys !== undefined) {
        for (const key of keys) {
          const elem = editor.getElementByKey(key);
          if (elem !== null) {
            elem.classList.add("selected");
            changedElems.push(elem);
          }
        }
      }
    }
    return () => {
      for (let i = 0; i < changedElems.length; i++) {
        const changedElem = changedElems[i];
        changedElem.classList.remove("selected");
      }
    };
  }, [activeIDs, editor, markNodeMap]);

  useEffect(() => {
    const markNodeKeysToIDs: Map<NodeKey, Array<string>> = new Map();

    return mergeRegister(
      registerNestedElementResolver<MarkNode>(
        editor,
        MarkNode,
        (from: MarkNode) => {
          return $createMarkNode(from.getIDs());
        },
        (from: MarkNode, to: MarkNode) => {
          // Merge the IDs
          const ids = from.getIDs();
          ids.forEach((id) => {
            to.addID(id);
          });
        },
      ),
      editor.registerMutationListener(MarkNode, (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, mutation] of mutations) {
            const node: null | MarkNode = $getNodeByKey(key);
            let ids: NodeKey[] = [];

            if (mutation === "destroyed") {
              ids = markNodeKeysToIDs.get(key) || [];
            } else if ($isMarkNode(node)) {
              ids = node.getIDs();
            }

            for (let i = 0; i < ids.length; i++) {
              const id = ids[i];
              let markNodeKeys = markNodeMap.get(id);
              markNodeKeysToIDs.set(key, ids);

              if (mutation === "destroyed") {
                if (markNodeKeys !== undefined) {
                  markNodeKeys.delete(key);
                  if (markNodeKeys.size === 0) {
                    markNodeMap.delete(id);
                  }
                }
              } else {
                if (markNodeKeys === undefined) {
                  markNodeKeys = new Set();
                  markNodeMap.set(id, markNodeKeys);
                }
                if (!markNodeKeys.has(key)) {
                  markNodeKeys.add(key);
                }
              }
            }
          }
        });
      }),
      editor.registerUpdateListener(({ editorState, tags }) => {
        editorState.read(() => {
          const selection = $getSelection();
          let hasActiveIds = false;

          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();

            if ($isTextNode(anchorNode)) {
              const exampleIDs = $getMarkIDs(
                anchorNode,
                selection.anchor.offset,
              );
              if (exampleIDs !== null) {
                setActiveIDs(exampleIDs);
                hasActiveIds = true;
              }
            }
          }
          if (!hasActiveIds) {
            setActiveIDs((_activeIds) =>
              _activeIds.length === 0 ? _activeIds : []
            );
          }
        });
        if (!tags.has("collaboration")) {
          setShowExampleInput(false);
        }
      }),
      editor.registerCommand(
        INSERT_INLINE_COMMAND,
        () => {
          const domSelection = globalThis.getSelection();
          if (domSelection !== null) {
            domSelection.removeAllRanges();
          }
          setShowExampleInput(true);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor, markNodeMap]);

  const onAddExample = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  return isInDom
    ? (
      <>
        {showExampleInput &&
          createPortal(
            <ExampleInputBox
              editor={editor}
              cancelAddExample={cancelAddExample}
              submitAddExample={submitAddExample}
            />,
            document.body,
          )}
        {showAddBox && !showExampleInput && createPortal(
          <AddExampleBox
            editor={editor}
            onAddExample={onAddExample}
          />,
          document.body,
        )}
        {createPortal(
          <ExamplesPanelList
            examples={examples}
            submitAddExample={submitAddExample}
            deleteExampleOrThread={deleteExampleOrThread}
            activeIDs={activeIDs}
            markNodeMap={markNodeMap}
          />,
          document.getElementById("examplesPortal") as Element,
        )}
      </>
    )
    : <div>Not in dom</div>;
}
