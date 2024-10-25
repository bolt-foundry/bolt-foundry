/**
 * @generated SignedSource<<cb21e3a03776bb67350bdc6c6afb5744>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Media_bfOrganization$data = {
  readonly id: string;
  readonly media: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly filename: string | null | undefined;
        readonly id: string;
        readonly name: string | null | undefined;
        readonly previewVideo: {
          readonly id: string;
          readonly url: string | null | undefined;
          readonly " $fragmentSpreads": FragmentRefs<"PillStatusPreviewVideo_bfVideo">;
        } | null | undefined;
        readonly transcript: {
          readonly words: ReadonlyArray<{
            readonly __typename: "AssemblyAIWord";
          } | null | undefined> | null | undefined;
          readonly " $fragmentSpreads": FragmentRefs<"PillStatusTranscript_bfTranscript" | "TranscriptWordCount_bfTranscript">;
        } | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "Media_bfOrganization";
};
export type Media_bfOrganization$key = {
  readonly " $data"?: Media_bfOrganization$data;
  readonly " $fragmentSpreads": FragmentRefs<"Media_bfOrganization">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Media_bfOrganization",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "BfMediaConnection",
      "kind": "LinkedField",
      "name": "media",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "BfMediaEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "BfMedia",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "filename",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "BfMediaNodeVideo",
                  "kind": "LinkedField",
                  "name": "previewVideo",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "url",
                      "storageKey": null
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "PillStatusPreviewVideo_bfVideo"
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "BfMediaNodeTranscript",
                  "kind": "LinkedField",
                  "name": "transcript",
                  "plural": false,
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "PillStatusTranscript_bfTranscript"
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "TranscriptWordCount_bfTranscript"
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
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "media(first:100)"
    }
  ],
  "type": "BfOrganization",
  "abstractKey": null
};
})();

(node as any).hash = "867a8c9d967568287b474ac5d51d0046";

export default node;
