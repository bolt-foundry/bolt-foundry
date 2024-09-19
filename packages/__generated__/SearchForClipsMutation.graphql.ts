/**
 * @generated SignedSource<<032703ee26966c1ef6b65096f08a27f6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SearchForClipsMutation$variables = {
  connections: ReadonlyArray<string>;
  query: string;
};
export type SearchForClipsMutation$data = {
  readonly createSearchResult: {
    readonly id: string;
    readonly query: string | null | undefined;
  } | null | undefined;
};
export type SearchForClipsMutation = {
  response: SearchForClipsMutation$data;
  variables: SearchForClipsMutation$variables;
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
  "concreteType": "BfSearchResult",
  "kind": "LinkedField",
  "name": "createSearchResult",
  "plural": false,
  "selections": [
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
      "name": "id",
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
    "name": "SearchForClipsMutation",
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
    "name": "SearchForClipsMutation",
    "selections": [
      (v3/*: any*/),
      {
        "alias": null,
        "args": (v2/*: any*/),
        "filters": null,
        "handle": "appendNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createSearchResult",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          },
          {
            "kind": "Literal",
            "name": "edgeTypeName",
            "value": "BfSearchResult"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "75583295f2337f5cff993d01d86dba71",
    "id": null,
    "metadata": {},
    "name": "SearchForClipsMutation",
    "operationKind": "mutation",
    "text": "mutation SearchForClipsMutation(\n  $query: String!\n) {\n  createSearchResult(query: $query) {\n    query\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e2505028cbde76e5d225e04e8c93d2a4";

export default node;
