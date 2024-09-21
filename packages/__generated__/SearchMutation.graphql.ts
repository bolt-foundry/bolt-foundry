/**
 * @generated SignedSource<<19945763c1435bb4b9b1fc69c11de1ff>>
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
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BfSavedSearchEdge",
        "kind": "LinkedField",
        "name": "createSavedSearch",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
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
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "BfSavedSearchEdge",
        "kind": "LinkedField",
        "name": "createSavedSearch",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "node",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "BfSavedSearchEdge"
              }
            ]
          }
        ],
        "storageKey": null
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

(node as any).hash = "b31dc071097147da6c0e9e6ce313f949";

export default node;
