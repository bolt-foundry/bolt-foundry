import { useState } from "react";
import { CfDsInput } from "@bfmono/apps/cfDs/components/CfDsInput.tsx";
import { CfDsPill } from "@bfmono/apps/cfDs/components/CfDsPill.tsx";
import { CfDsIcon } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
const logger = getLogger(import.meta);

export interface TagInputProps {
  label: string;
  name: string;
  value: Array<string>;
  onChange?: (tags: Array<string>) => void;
}

export function CfDsTagInput(
  { label, name, value = [], onChange }: TagInputProps,
) {
  const [tags, setTags] = useState<Array<string>>(
    Array.isArray(value) ? value : [],
  );
  const [newTags, setNewTags] = useState<Array<string>>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        const newlyAddedTags = [...newTags, newTag];
        setNewTags(newlyAddedTags);
        setTags(updatedTags);
        onChange &&
          onChange(updatedTags);
        e.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter((t: string) => t !== tag);
    setTags(updatedTags);
    onChange &&
      onChange(updatedTags);
  };

  const isNew = (tag: string) => newTags.includes(tag);

  return (
    <label className="flexColumn" htmlFor={name} style={{ marginBottom: 12 }}>
      {label}
      <CfDsInput
        name={name}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press enter..."
      />
      {tags.length > 0 && (
        <div className="tags" style={{ marginTop: 8 }}>
          {tags.map((tag: string) => (
            <CfDsPill
              color={isNew(tag) ? "secondaryColor" : "textSecondary"}
              key={tag}
              label={tag}
              action={
                <div
                  className="flexRow"
                  onClick={() => removeTag(tag)}
                >
                  <CfDsIcon
                    name="cross"
                    size={8}
                    color="var(--textSecondary)"
                  />
                </div>
              }
            />
          ))}
        </div>
      )}
    </label>
  );
}

export function Example() {
  const handleTagsChange = (updatedTags: Array<string>) => {
    logger.log("Updated tags:", updatedTags);
  };

  return (
    <CfDsTagInput
      label="Tags"
      name="example-tags"
      value={["initialTag1", "initialTag2"]}
      onChange={handleTagsChange}
    />
  );
}
