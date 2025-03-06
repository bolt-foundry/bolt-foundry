
import * as React from "react";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

export type TextAreaContentEditableProps = {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<any> | { target: { value: string } }) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  required?: boolean;
  rows?: number;
  xstyle?: React.CSSProperties;
  passedRef?: React.RefObject<HTMLDivElement | HTMLTextAreaElement | null>;
  id?: string;
};

const styles: Record<string, React.CSSProperties> = {
  contentEditable: {
    background: "var(--background)",
    color: "var(--text)",
    fontFamily: "var(--fontFamily)",
    fontSize: 16,
    padding: "6px 12px",
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--textSecondary)",
    boxSizing: "border-box",
    outline: "none",
    overflowY: "auto",
    minHeight: "calc(2em + 12px)", // Default for 2 rows
    whiteSpace: "pre-wrap",
  },
  placeholder: {
    position: "absolute",
    pointerEvents: "none",
    color: "var(--textSecondary)",
    padding: "6px 12px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 12,
  },
  wrapper: {
    position: "relative",
  },
};

export function BfDsTextAreaContentEditable(
  {
    label,
    value,
    onChange,
    placeholder,
    className,
    name,
    required,
    rows = 2,
    xstyle,
    passedRef,
    ...props
  }: TextAreaContentEditableProps,
) {
  const editableRef = passedRef ?? React.useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  
  // Calculate minimum height based on rows
  const minHeight = `calc(${rows}em + 12px)`;

  // get positioning and sizing out of xstyle
  const { top, left, width, height, flex, display, ...rest } = xstyle ?? {};
  const xstyleInner = {
    top, left, width, height, flex, display
  }
  
  // Merge styles with custom and row-based minHeight
  const mergedStyles = {
    ...styles.contentEditable,
    ...rest,
    minHeight,
  };

  React.useEffect(() => {
    const editable = editableRef.current;
    if (!editable) return;

    // Set content from value prop
    if (editable.textContent !== value) {
      editable.textContent = value;
    }
  }, [value]);

  // Handle input changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || "";
    
    // Create an event-like object that mimics textarea's onChange event
    const syntheticEvent = {
      target: {
        value: newValue,
        name,
      },
      currentTarget: e.currentTarget,
    };
    
    onChange(syntheticEvent);
  };

  // Add selection range functionality to make compatible with textarea
  React.useImperativeHandle(editableRef, () => {
    const div = editableRef.current;
    if (!div) {
      // Create a fallback object with empty implementations
      return {
        setSelectionRange: () => {},
        select: () => {},
        focus: () => {},
        value: "",
      } as unknown as HTMLDivElement;
    }

    // Add setSelectionRange method to the div ref
    const enhancedDiv = div as HTMLDivElement & {
      setSelectionRange: (start: number, end: number) => void;
      select: () => void;
      focus: () => void;
    };

    // Implement setSelectionRange method
    enhancedDiv.setSelectionRange = (start: number, end: number) => {
      const range = document.createRange();
      const sel = globalThis.getSelection();
      
      // Ensure we have text content to select
      if (!div.textContent) return;
      
      try {
        if (start >= 0 && end <= (div.textContent.length || 0) && sel) {
          // Create range from text node
          const textNode = div.firstChild || div;
          range.setStart(textNode, start);
          range.setEnd(textNode, end);
          
          // Apply selection
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch (error) {
        logger.error("Error setting selection range:", error);
      }
    };

    // Implement select method
    enhancedDiv.select = () => {
      const range = document.createRange();
      const sel = globalThis.getSelection();
      
      try {
        if (div.textContent && sel) {
          range.selectNodeContents(div);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch (error) {
        logger.error("Error selecting content:", error);
      }
    };

    // Ensure focus method works properly
    const originalFocus = div.focus;
    enhancedDiv.focus = () => {
      originalFocus.call(div);
      setIsFocused(true);
    };

    // Add value property to make it more compatible with textarea
    Object.defineProperty(enhancedDiv, 'value', {
      get: function() {
        return this.textContent || '';
      },
      set: function(newValue) {
        this.textContent = newValue;
      }
    });

    return enhancedDiv;
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const contentEditable = (
    <div style={{...styles.wrapper, ...xstyleInner}}>
      <div
        ref={editableRef as React.RefObject<HTMLDivElement>}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={mergedStyles}
        className={className}
        role="textbox"
        aria-multiline="true"
        {...props}
      />
      {!isFocused && !value && placeholder && (
        <div style={styles.placeholder}>
          {placeholder}
        </div>
      )}
    </div>
  );

  if (label) {
    return (
      <label style={styles.label}>
        {label}
        {required && " *"}
        {contentEditable}
      </label>
    );
  }
  return contentEditable;
}
