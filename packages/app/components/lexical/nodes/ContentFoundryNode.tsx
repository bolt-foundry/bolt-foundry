import type { JSX } from "react";
import {
  DecoratorBlockNode,
  type SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import type { LexicalNode, NodeKey, Spread } from "lexical";

export type Example = {
  id: string;
  content: string;
  author: string;
  timeStamp: number;
};

export type SerializedContentFoundryNode = Spread<
  {
    examples: Array<Example>;
  },
  SerializedDecoratorBlockNode
>;

export class ContentFoundryNode extends DecoratorBlockNode {
  __examples: Array<Example>;

  static override getType(): string {
    return "content-foundry-example";
  }

  static override clone(node: ContentFoundryNode): ContentFoundryNode {
    return new ContentFoundryNode(
      node.__examples,
      node.__key,
    );
  }

  constructor(examples: Array<Example> = [], key?: NodeKey) {
    super(key);
    this.__examples = examples;
  }

  override createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "ContentFoundry-block";
    return div;
  }

  override updateDOM(): false {
    return false;
  }

  addExample(content: string, author: string): void {
    const newExample = {
      id: crypto.randomUUID(),
      content,
      author,
      timeStamp: performance.now(),
    };
    this.__examples = [...this.__examples, newExample];
    this.getWritable();
  }

  deleteExample(exampleId: string): void {
    this.__examples = this.__examples.filter(
      (example) => example.id !== exampleId,
    );
    this.getWritable();
  }

  getExamples(): Array<Example> {
    return this.__examples;
  }

  override decorate(): JSX.Element {
    return (
      <ContentFoundryComponent
        nodeKey={this.__key}
        examples={this.__examples}
      />
    );
  }

  override exportJSON(): SerializedContentFoundryNode {
    return {
      ...super.exportJSON(),
      examples: this.__examples,
      type: "content-foundry-example",
      version: 1,
    };
  }

  static override importJSON(
    serializedNode: SerializedContentFoundryNode,
  ): ContentFoundryNode {
    const node = new ContentFoundryNode(
      serializedNode.examples,
    );
    return node;
  }
}

export function $createContentFoundryNode(): ContentFoundryNode {
  return new ContentFoundryNode();
}

export function $isContentFoundryNode(
  node: LexicalNode | null | undefined,
): node is ContentFoundryNode {
  return node instanceof ContentFoundryNode;
}

function ContentFoundryComponent({
  nodeKey,
  examples,
}: {
  nodeKey: NodeKey;
  examples: Array<Example>;
}): JSX.Element {
  return (
    <div className="ContentFoundry-root" data-key={nodeKey}>
      <div className="ContentFoundry-examples-count">
        {examples.length} example{examples.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
