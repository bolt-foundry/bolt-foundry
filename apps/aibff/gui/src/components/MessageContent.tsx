import { extractCodeBlocks } from "../utils/codeBlockExtractor.ts";
import { CodeBlockWithAction } from "./CodeBlockWithAction.tsx";
import { useGrader } from "../contexts/GraderContext.tsx";

interface MessageContentProps {
  content: string;
  role: "user" | "assistant";
}

export function MessageContent({ content, role }: MessageContentProps) {
  const { appendToGrader } = useGrader();

  // Only process assistant messages for code blocks
  if (role === "user") {
    return <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>;
  }

  const codeBlocks = extractCodeBlocks(content);

  if (codeBlocks.length === 0) {
    return <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>;
  }

  // Split content into parts with code blocks
  const parts: Array<React.ReactNode> = [];
  let lastIndex = 0;

  codeBlocks.forEach((block, index) => {
    // Add text before code block
    if (block.startIndex > lastIndex) {
      const textBefore = content.substring(lastIndex, block.startIndex);
      if (textBefore.trim()) {
        parts.push(
          <div key={`text-${index}`} style={{ whiteSpace: "pre-wrap" }}>
            {textBefore}
          </div>,
        );
      }
    }

    // Add code block
    const isMarkdown = block.language === "markdown" || block.language === "md";
    parts.push(
      <CodeBlockWithAction
        key={`code-${index}`}
        content={block.content}
        language={block.language}
        onAddToGrader={isMarkdown
          ? () => appendToGrader(block.content)
          : undefined}
      />,
    );

    lastIndex = block.endIndex;
  });

  // Add remaining text after last code block
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex);
    if (remainingText.trim()) {
      parts.push(
        <div key="text-final" style={{ whiteSpace: "pre-wrap" }}>
          {remainingText}
        </div>,
      );
    }
  }

  return <>{parts}</>;
}
