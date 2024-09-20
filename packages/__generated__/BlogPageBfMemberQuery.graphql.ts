/**
 * @generated SignedSource<<7d33a52aa3089c3968df108330965add>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AccountRole = "ADMIN" | "ANON" | "MEMBER" | "OMNI" | "OWNER" | "REFRESH_CREDENTIALS_ONLY" | "SERVICE_INGESTION" | "%future added value";
export type BlogPageBfMemberQuery$variables = Record<PropertyKey, never>;
export type BlogPageBfMemberQuery$data = {
  readonly currentViewer: {
    readonly role: AccountRole | null | undefined;
  } | null | undefined;
};
export type BlogPageBfMemberQuery = {
  response: BlogPageBfMemberQuery$data;
  variables: BlogPageBfMemberQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BlogPageBfMemberQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "BlogPageBfMemberQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "currentViewer",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "06897e1195cfce253cd02f9ca3929cf4",
    "id": null,
    "metadata": {},
    "name": "BlogPageBfMemberQuery",
    "operationKind": "query",
    "text": "query BlogPageBfMemberQuery {\n  currentViewer {\n    __typename\n    role\n  }\n}\n"
  }
};
})();

(node as any).hash = "58036caa72fea5d4b46931575d9bba0a";

export default node;
