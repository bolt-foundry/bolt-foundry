/**
 * @generated SignedSource<<0f702d095b3ca89c0cae17f3c739f31b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TranscriptWordCount_bfTranscript$data = {
  readonly id: string;
  readonly words: ReadonlyArray<{
    readonly __typename: "AssemblyAIWord";
  } | null | undefined> | null | undefined;
  readonly " $fragmentType": "TranscriptWordCount_bfTranscript";
};
export type TranscriptWordCount_bfTranscript$key = {
  readonly " $data"?: TranscriptWordCount_bfTranscript$data;
  readonly " $fragmentSpreads": FragmentRefs<"TranscriptWordCount_bfTranscript">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TranscriptWordCount_bfTranscript",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AssemblyAIWord",
      "kind": "LinkedField",
      "name": "words",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "BfMediaNodeTranscript",
  "abstractKey": null
};

(node as any).hash = "ce56e8ab8d7cdb0e192bd47dfd441795";

export default node;
