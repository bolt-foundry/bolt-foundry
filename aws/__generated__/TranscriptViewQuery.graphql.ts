/**
 * @generated SignedSource<<c2632f8133d73aca118ba1d199908b93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TranscriptViewQuery$variables = {
  id: string;
};
export type TranscriptViewQuery$data = {
  readonly project: {
    readonly clips: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly end_index: number | null | undefined;
          readonly end_time: number | null | undefined;
          readonly id: string | null | undefined;
          readonly start_index: number | null | undefined;
          readonly start_time: number | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly id: string | null | undefined;
    readonly transcripts: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string | null | undefined;
          readonly words: string | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type TranscriptViewQuery = {
  response: TranscriptViewQuery$data;
  variables: TranscriptViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Project",
    "kind": "LinkedField",
    "name": "project",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 1000
          }
        ],
        "concreteType": "ClipConnection",
        "kind": "LinkedField",
        "name": "clips",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ClipEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Clip",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "start_index",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "end_index",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "start_time",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "end_time",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "clips(first:1000)"
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
                  (v1/*: any*/),
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TranscriptViewQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TranscriptViewQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "fde14834ef35a94559d0d29dc4766c72",
    "id": null,
    "metadata": {},
    "name": "TranscriptViewQuery",
    "operationKind": "query",
    "text": "query TranscriptViewQuery(\n  $id: ID!\n) {\n  project(id: $id) {\n    id\n    clips(first: 1000) {\n      edges {\n        node {\n          id\n          start_index\n          end_index\n          start_time\n          end_time\n        }\n      }\n    }\n    transcripts(first: 1) {\n      edges {\n        node {\n          id\n          words\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9755b0b5007f88fbf7ac93f5de4baac0";

export default node;
