/**
 * @generated SignedSource<<ad949f31ca71fb6316007a4f6048de36>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Media_bfOrganization$data = {
  readonly media: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly filename: string | null | undefined;
        readonly transcripts: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly words: string | null | undefined;
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

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Media_bfOrganization",
  "selections": [
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "filename",
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
                  "concreteType": "BfMediaTranscriptConnection",
                  "kind": "LinkedField",
                  "name": "transcripts",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BfMediaTranscriptEdge",
                      "kind": "LinkedField",
                      "name": "edges",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "BfMediaTranscript",
                          "kind": "LinkedField",
                          "name": "node",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "words",
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

(node as any).hash = "fe800e1317388c360b57b42e6c7b75de";

export default node;
