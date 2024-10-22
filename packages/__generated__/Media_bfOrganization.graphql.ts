/**
 * @generated SignedSource<<4945ef0c177a95db5800ca0b3b3d077d>>
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
        readonly previewVideoStatus: string | null | undefined;
        readonly previewVideoUrl: string | null | undefined;
        readonly transcriptStatus: string | null | undefined;
        readonly transcripts: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly words: ReadonlyArray<{
                readonly confidence: number | null | undefined;
                readonly end: number | null | undefined;
                readonly speaker: string | null | undefined;
                readonly start: number | null | undefined;
                readonly text: string | null | undefined;
              } | null | undefined> | null | undefined;
            } | null | undefined;
          } | null | undefined> | null | undefined;
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
                  "kind": "ScalarField",
                  "name": "previewVideoUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "transcriptStatus",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "previewVideoStatus",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "first",
                      "value": 1
                    }
                  ],
                  "concreteType": "BfMediaNodeTranscriptConnection",
                  "kind": "LinkedField",
                  "name": "transcripts",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BfMediaNodeTranscriptEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BfMediaNodeTranscript",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
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
                                  "name": "start",
                                  "storageKey": null
                                },
                                {
                                  "alias": null,
                                  "args": null,
                                  "kind": "ScalarField",
                                  "name": "end",
                                  "storageKey": null
                                },
                                {
                                  "alias": null,
                                  "args": null,
                                  "kind": "ScalarField",
                                  "name": "text",
                                  "storageKey": null
                                },
                                {
                                  "alias": null,
                                  "args": null,
                                  "kind": "ScalarField",
                                  "name": "confidence",
                                  "storageKey": null
                                },
                                {
                                  "alias": null,
                                  "args": null,
                                  "kind": "ScalarField",
                                  "name": "speaker",
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
                  "storageKey": "transcripts(first:1)"
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

(node as any).hash = "7d81bd10b904e0ab3269a7f7b68638fa";

export default node;
