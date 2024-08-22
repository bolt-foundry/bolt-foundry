import * as React from "react";
import { Input } from "packages/bfDs/Input.tsx";
import { DropdownSelector } from "packages/bfDs/DropdownSelector.tsx";
import { useClipSearchState } from "packages/client/contexts/ClipSearchContext.tsx";
import { AiModel } from "packages/client/contexts/ClipSearchContext.tsx";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";

export function Search() {
  const { aiModel, setAiModel, commitSearch, isInFlight, prompt, setPrompt } =
    useClipSearchState();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    commitSearch();
  }

  return (
    <form onSubmit={onSubmit} className="cs-search">
      <Input
        placeholder="Search"
        showSpinner={isInFlight}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        style={{ flex: 1 }}
      />
      <DropdownSelector
        placeholder="Select AI Model"
        value={aiModel}
        onChange={(value) => setAiModel(value as AiModel)}
        options={{
          "GPT 3.5 turbo": AiModel.OPENAI_35,
          "GPT 4o mini": AiModel.OPENAI_4O,
          "Claude 3 opus": AiModel.CLAUDE_OPUS,
          "Claude 3.5 sonnet": AiModel.CLAUDE_SONNET,
        }}
        justification="end"
      />
      <BfDsButton type="submit" text="Search" />
    </form>
  );
}
