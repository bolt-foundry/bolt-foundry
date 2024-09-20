/**
 * @generated SignedSource<<ae75632c11b0c83012396e6125becb55>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SearchStatus = "COMPLETED" | "ERRORED" | "PENDING" | "RUNNING" | "%future added value";
export type SearchMutation$variables = {
  connections: ReadonlyArray<string>;
  query: string;
};
export type SearchMutation$data = {
  readonly createSavedSearch: {
    readonly node: {
      readonly id: string;
      readonly query: string | null | undefined;
      readonly status: SearchStatus | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type SearchMutation = {
  response: SearchMutation$data;
  variables: SearchMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v2 = [
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  }
],
v3 = {
  "alias": null,
  "args": (v2/*: any*/),
  "concreteType": "BfSavedSearchEdge",
  "kind": "LinkedField",
  "name": "createSavedSearch",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "BfSavedSearch",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
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
          "name": "query",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "status",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchMutation",
    "selections": [
      (v3/*: any*/)
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "SearchMutation",
    "selections": [
      (v3/*: any*/),
      {
        "alias": null,
        "args": (v2/*: any*/),
        "filters": null,
        "handle": "appendEdge",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createSavedSearch",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "3a11fb3d9b68bb18de2e090283eb3770",
    "id": null,
    "metadata": {},
    "name": "SearchMutation",
    "operationKind": "mutation",
    "text": "mutation SearchMutation(\n  $query: String!\n) {\n  createSavedSearch(query: $query) {\n    node {\n      id\n      query\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6f47caa56cb8710b14a67f5907f7c8cd";

export default node;
