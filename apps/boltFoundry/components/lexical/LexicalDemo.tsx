/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $isTextNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type DOMExportOutputMap,
  isHTMLElement,
  type Klass,
  type LexicalEditor,
  type LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import SampleEditorTheme from "@bfmono/apps/boltFoundry/components/lexical/themes/SampleEditorTheme.ts";
import ToolbarPlugin from "@bfmono/apps/boltFoundry/components/lexical/plugins/ToolbarPlugin.tsx";
import {
  parseAllowedColor,
  parseAllowedFontSize,
} from "@bfmono/apps/boltFoundry/components/lexical/styleConfig.ts";
import TreeViewPlugin from "@bfmono/apps/boltFoundry/components/lexical/plugins/TreeViewPlugin.tsx";
import { ContentFoundryPlugin } from "@bfmono/apps/boltFoundry/components/lexical/plugins/ContentFoundryPlugin.tsx";
import { MarkNode } from "@lexical/mark";
import { SubpageHeaderTitle } from "@bfmono/apps/boltFoundry/components/Header/SubpageHeaderTitle.tsx";

const placeholder = "Enter some rich text...";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode,
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (
      const el of [
        output.element,
        ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
      ]
    ) {
      el.removeAttribute("class");
      el.removeAttribute("style");
      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "Voice editor",
  nodes: [ParagraphNode, TextNode, MarkNode],
  onError(error: Error) {
    throw error;
  },
  theme: SampleEditorTheme,
};

export function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="flex1 flexColumn full-editor-container">
        <ToolbarPlugin />
        <div className="flex1 flexColumn editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="flex1 editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ContentFoundryPlugin />
        </div>
        <TreeViewPlugin />
      </div>
    </LexicalComposer>
  );
}

export function EditorPage() {
  return (
    <div className="flexRow editor-container">
      {/* Sidebar */}
      <div className="flexColumn left-side-bar">
        <div className="sidebar-header">
          <SubpageHeaderTitle>
            Voice editor
          </SubpageHeaderTitle>
        </div>
      </div>
      {/* Editor */}
      <Editor />
      {/* Right sidebar */}
      <div className="flexColumn right-side-bar">
        <div className="sessions-container" id="samplesPortal">
          {/* Samples get portal'd here */}
        </div>
      </div>
    </div>
  );
}
