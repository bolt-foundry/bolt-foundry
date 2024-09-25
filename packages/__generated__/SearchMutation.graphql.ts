/**
 * @generated SignedSource<<8858a0aff50a2c9dbfa75163bef69ea0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SearchMutation$variables = {
  collectionId: string;
  query: string;
};
export type SearchMutation$data = {
  readonly searchCollection: {
    readonly id: string;
    readonly query: string | null | undefined;
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
  "name": "collectionId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "query"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "collectionId",
        "variableName": "collectionId"
      },
      {
        "kind": "Variable",
        "name": "query",
        "variableName": "query"
      }
    ],
    "concreteType": "BfSavedSearch",
    "kind": "LinkedField",
    "name": "searchCollection",
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchMutation",
    "selections": (v2/*: any*/),
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
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "7975322910d4173e690a6fb77fa047a1",
    "id": null,
    "metadata": {},
    "name": "SearchMutation",
    "operationKind": "mutation",
    "text": "mutation SearchMutation(\n  $query: String!\n  $collectionId: ID!\n) {\n  searchCollection(query: $query, collectionId: $collectionId) {\n    id\n    query\n  }\n}\n"
  }
};
})();

(node as any).hash = "e70660c14162caccdbd1a4ed33535a45";

export default node;
