/**
 * @generated SignedSource<<fd92be9bd9467d2e60d9ef1a53a498f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SearchForClipsMutation$variables = {
  query: string;
};
export type SearchForClipsMutation$data = {
  readonly createSearch: {
    readonly __typename: "BfSearchResult";
  } | null | undefined;
};
export type SearchForClipsMutation = {
  response: SearchForClipsMutation$data;
  variables: SearchForClipsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "query"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchForClipsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfSearchResult",
        "kind": "LinkedField",
        "name": "createSearch",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SearchForClipsMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfSearchResult",
        "kind": "LinkedField",
        "name": "createSearch",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e697d991ac4e0234744f95cedcad5d8b",
    "id": null,
    "metadata": {},
    "name": "SearchForClipsMutation",
    "operationKind": "mutation",
    "text": "mutation SearchForClipsMutation(\n  $query: String!\n) {\n  createSearch(query: $query) {\n    __typename\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e4d9ea87ca3612f7c6defb83afebaeec";

export default node;
