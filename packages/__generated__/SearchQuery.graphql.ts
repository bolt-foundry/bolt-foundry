/**
 * @generated SignedSource<<71a8ecb505852f57ce6e2cc20a7eae79>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SearchQuery$variables = Record<PropertyKey, never>;
export type SearchQuery$data = {
  readonly transcripts: ReadonlyArray<{
    readonly filename: string | null | undefined;
    readonly id: string;
    readonly transcript: string | null | undefined;
  } | null | undefined>;
};
export type SearchQuery = {
  response: SearchQuery$data;
  variables: SearchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "BfTranscript",
    "kind": "LinkedField",
    "name": "transcripts",
    "plural": true,
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
        "kind": "ScalarField",
        "name": "filename",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "transcript",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SearchQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "35229ec06e0a2a4cfcc7d1ba2457ac19",
    "id": null,
    "metadata": {},
    "name": "SearchQuery",
    "operationKind": "query",
    "text": "query SearchQuery {\n  transcripts {\n    id\n    filename\n    transcript\n  }\n}\n"
  }
};
})();

(node as any).hash = "b1a06ad18773214a8e07f7137cb455a1";

export default node;
