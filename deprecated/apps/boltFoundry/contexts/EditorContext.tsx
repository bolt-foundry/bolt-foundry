import type React from "react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { BfError } from "@bfmono/lib/BfError.ts";
import { findIndexRange } from "@bfmono/apps/boltFoundry/lib/editorHelper.ts";

const logger = getLogger(import.meta);

type EditorContextType = {
  blogPost: string;
  setBlogPost: (blogPost: string) => void;
  highlightTextInEditor: (textToHighlight: string) => void;
  unhighlightTextInEditor: () => void;
  replaceTextInEditor: (originalText: string, newText: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  highlightedText: string | null;
};

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};

type EditorProviderProps = {
  children: ReactNode;
};

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [blogPost, setBlogPost] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const highlightTextInEditor = useCallback((textToHighlight: string) => {
    setHighlightedText(textToHighlight);

    // Use setTimeout to ensure we run this after the current render cycle
    setTimeout(() => {
      // Find the textarea element directly if ref isn't set yet
      const textarea = textareaRef.current ||
        document.getElementById(
          "formatter-editor-textarea",
        ) as HTMLTextAreaElement;

      if (textToHighlight && textarea) {
        const content = textarea.value;
        const indexRange = findIndexRange(
          content,
          textToHighlight,
        );
        if (!indexRange) {
          throw new BfError("Could not find text to highlight");
        }
        textarea.setSelectionRange(
          indexRange[0],
          indexRange[1],
        );
        textarea.focus();

        // Scroll to the selected text
        textarea.scrollTop =
          (textarea.scrollHeight * indexRange[0]) / content.length -
          (textarea.clientHeight / 2);
      } else {
        logger.warn(
          "Cannot highlight text: textarea or text not available",
          !!textarea,
          !!textToHighlight,
        );
      }
    }, 0);
  }, []);

  const unhighlightTextInEditor = useCallback(() => {
    setHighlightedText(null);
    const textarea = textareaRef.current ||
      document.getElementById(
        "formatter-editor-textarea",
      ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.setSelectionRange(null, null);
    }
  }, []);

  const replaceTextInEditor = useCallback(
    (originalText: string, newText: string) => {
      const textarea = textareaRef.current ||
        document.getElementById(
          "formatter-editor-textarea",
        ) as HTMLTextAreaElement;

      if (!textarea) {
        logger.debug("No textarea found for text replacement");
        return;
      }

      const content = textarea.value;
      const indexRange = findIndexRange(
        content,
        originalText,
      );
      if (!indexRange) {
        throw new BfError("Could not find text to replace");
      }

      // Replace the text
      const newContent = content.substring(0, indexRange[0]) +
        newText +
        content.substring(indexRange[1]);

      // Update the textarea value
      setBlogPost(newContent);

      // Highlight the new text
      setTimeout(() => {
        highlightTextInEditor(newText);
      }, 0);
    },
    [highlightTextInEditor],
  );

  const value = {
    blogPost,
    setBlogPost,
    highlightTextInEditor,
    unhighlightTextInEditor,
    replaceTextInEditor,
    textareaRef,
    highlightedText,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
