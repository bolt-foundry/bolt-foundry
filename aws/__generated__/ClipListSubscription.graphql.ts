/**
 * @generated SignedSource<<f02b46c522594f009d4275960330051f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
export type ClipListSubscription$variables = {
  id: string;
};
export type ClipListSubscription$data = {
  readonly project: {
    readonly transcripts: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly transcriptLength: number | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type ClipListSubscription = {
  response: ClipListSubscription$data;
  variables: ClipListSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "transcriptLength",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipListSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "TranscriptConnection",
            "kind": "LinkedField",
            "name": "transcripts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TranscriptEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Transcript",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/)
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
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ClipListSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "TranscriptConnection",
            "kind": "LinkedField",
            "name": "transcripts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TranscriptEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Transcript",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "transcripts(first:1)"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "89b1a20f548448e055f2af7b2e966110",
    "id": null,
    "metadata": {},
    "name": "ClipListSubscription",
    "operationKind": "subscription",
    "text": "subscription ClipListSubscription(\n  $id: ID!\n) {\n  project(id: $id) {\n    transcripts(first: 1) {\n      edges {\n        node {\n          transcriptLength\n          id\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "940242e08f38d45d1dd78f9cb21578c4";

export default node;
