import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

type EditorContextType = {
  highlightTextInEditor: (textToHighlight: string) => void;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const highlightTextInEditor = useCallback((textToHighlight: string) => {
    setHighlightedText(textToHighlight);

    // Use setTimeout to ensure we run this after the current render cycle
    setTimeout(() => {
      // Find the textarea element directly if ref isn't set yet
      const textarea = textareaRef.current || document.getElementById('formatter-editor-textarea') as HTMLTextAreaElement;

      if (textToHighlight && textarea) {
        const content = textarea.value;
        
        // First try exact match
        const exactIndex = content.indexOf(textToHighlight);
        
        if (exactIndex !== -1) {
          // Exact match found, use it directly
          logger.info("Found exact match at index:", exactIndex);
          textarea.setSelectionRange(exactIndex, exactIndex + textToHighlight.length);
          textarea.focus();
          
          // Scroll to the selected text
          textarea.scrollTop = 
            (textarea.scrollHeight * exactIndex) / content.length - 
            (textarea.clientHeight / 2);
            
          logger.info("Text highlighted successfully with exact match");
        } else {
          // No exact match, try to find a close match in the original text
          logger.info("No exact match found, searching for occurrence...");
          
          // Build a position mapping from normalized to original text
          const originalPositions: number[] = [];
          const normalizedContent = content.split('').map((char, index) => {
            if (/[\w\s]/.test(char)) {
              originalPositions.push(index);
              return char.toLowerCase();
            }
            return '';
          }).join('');
          
          // Normalize search text (remove punctuation, lowercase)
          const normalizedTextToHighlight = textToHighlight.split('').map(char => {
            return /[\w\s]/.test(char) ? char.toLowerCase() : '';
          }).join('');
          
          logger.info("Searching for normalized text:", normalizedTextToHighlight.substring(0, 50) + (normalizedTextToHighlight.length > 50 ? "..." : ""));
          
          // Find the normalized text in the normalized content
          const normalizedIndex = normalizedContent.indexOf(normalizedTextToHighlight);
          
          if (normalizedIndex !== -1) {
            // Map the normalized index back to the original text position
            const originalStartIndex = originalPositions[normalizedIndex] || 0;
            
            // For the end position, we need to use the original text length
            textarea.setSelectionRange(originalStartIndex, originalStartIndex + textToHighlight.length);
            textarea.focus();

          // Scroll to the selection
            textarea.scrollTop = 
              (textarea.scrollHeight * originalStartIndex) / content.length - 
              (textarea.clientHeight / 2);

            logger.info("Text highlighted successfully with normalized match");
          } else {
            logger.warn("Text to highlight not found in editor content after normalization");
          }
        }
      } else {
        logger.warn("Cannot highlight text: textarea or text not available", !!textarea, !!textToHighlight);
      }
    }, 0);
  }, []);

  const value = {
    highlightTextInEditor,
    textareaRef,
    highlightedText,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};