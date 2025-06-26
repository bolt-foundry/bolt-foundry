/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { EditorThemeClasses } from "lexical";

import baseTheme from "@bfmono/apps/boltFoundry/components/lexical/themes/PlaygroundEditorTheme.ts";

const theme: EditorThemeClasses = {
  ...baseTheme,
  paragraph: "SampleEditorTheme__paragraph",
};

export default theme;
