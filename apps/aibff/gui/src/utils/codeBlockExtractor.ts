interface CodeBlock {
  language: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export function extractCodeBlocks(text: string): Array<CodeBlock> {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks: Array<CodeBlock> = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || "text",
      content: match[2].trim(),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return blocks;
}

export function extractMarkdownBlocks(text: string): Array<string> {
  const blocks = extractCodeBlocks(text);
  return blocks
    .filter((block) => block.language === "markdown" || block.language === "md")
    .map((block) => block.content);
}
