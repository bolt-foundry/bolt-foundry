/// <reference path="https://esm.sh/v135/@types/google.accounts@0.0.14/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/google.picker@0.0.42/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/gapi.drive@0.0.9/index.d.ts" />
/// <reference path="https://esm.sh/v135/@types/gapi@0.0.47/index.d.ts" />
// @deno-types="https://esm.sh/v135/@types/react@18.2.38/index.d.ts";
import * as React from "react";
// @deno-types="https://esm.sh/v135/@types/react@18.2.38/index.d.ts";
import type * as ReactTypes from "react";
// @deno-types="https://esm.sh/v135/@types/react-dom@18.2.18/client~.d.ts";
import * as ReactDOMClient from "react-dom/client";
// @deno-types="https://esm.sh/v135/@types/react-dom@18.2.18/index.d.ts";
import * as ReactDOM from "react-dom";
// @deno-types="https://esm.sh/v135/@types/react-relay@16.0.6/index.d.ts";
import * as ReactRelay from "react-relay";
// @deno-types="https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
import * as RelayRuntime from "relay-runtime";
export * as GraphqlWs from "https://esm.sh/graphql-ws@5.14.0";
import "aws/__generated__/_graphql_imports.ts";

import * as MP4Box from "resources/thirdParty/mp4box.all.js";
export * as Mp4Muxer from "https://esm.sh/mp4-muxer@2.2.2";
export * as PosthogJs from "https://esm.sh/posthog-js@1.95.1";
export * as Rxjs from "deps.ts";
export * as mdxJs from "https://esm.sh/@mdx-js/mdx@3.0.0";
export * as ReactRuntime from "https://esm.sh/react@18.2.0/jsx-runtime";
export { default as remarkFrontmatter } from "https://esm.sh/remark-frontmatter@5.0.0";
export { default as remarkMdxFrontmatter } from "https://esm.sh/remark-mdx-frontmatter@4.0.0";

// export { ready as tfjsReady } from "https://esm.sh/@tensorflow/tfjs-core@4.15.0";
import "https://esm.sh/@tensorflow/tfjs-backend-webgl@4.15.0";

// @deno-types="https://esm.sh/v135/@tensorflow-models/pose-detection@2.1.3/dist/index.d.ts";
export * as TensorFlowPoseDetection from "https://esm.sh/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.js";

RelayRuntime.RelayFeatureFlags.ENABLE_RELAY_RESOLVERS = true;

export const isBrowser = typeof Deno === "undefined";
export type Maybe<T> = NonNullable<T> | null | undefined;
type OperationType = RelayRuntime.OperationType;
export type GQLSubConfigOperationType = RelayRuntime.GraphQLSubscriptionConfig<
  OperationType
>;

export async function graphql(
  strings: TemplateStringsArray,
) {
  if (typeof Deno !== "undefined") {
    const string = strings.raw[0];
    // regex to find the action type (query, mutation, subscription, fragment) and the query/fragment name, and the type it is on
    const regex =
      /(?<action>query|mutation|subscription|fragment)\s+(?<name>\w+)(\s+on\s+(?<type>\w+))?/;
    const { action, name } = string?.match(regex)?.groups ?? {};
    if (action && name) {
      const importName = name;
      const thing = await import(
        `aws/__generated__/${importName}.graphql.ts`
      );
      return thing;
    }
  }

  return ReactRelay.graphql(strings);
}

export {
  MP4Box,
  React,
  ReactDOM,
  ReactDOMClient,
  ReactRelay,
  ReactTypes,
  RelayRuntime,
};
