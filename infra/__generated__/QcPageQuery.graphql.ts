/**
 * @generated SignedSource<<95a906c84eac4826ab9ffa9c852b93ec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type QcPageQuery$variables = {
  ids: ReadonlyArray<string>;
};
export type QcPageQuery$data = {
  readonly clipsByOldClipIds: ReadonlyArray<{
    readonly client: string;
    readonly id: string;
    readonly oldClipId: string;
    readonly owner: string;
    readonly title: string;
  } | null | undefined> | null | undefined;
};
export type QcPageQuery = {
  response: QcPageQuery$data;
  variables: QcPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "ids"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "oldClipIds",
        "variableName": "ids"
      }
    ],
    "concreteType": "BfClip",
    "kind": "LinkedField",
    "name": "clipsByOldClipIds",
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
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "owner",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "client",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "oldClipId",
        "storageKey": null
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
    "name": "QcPageQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "QcPageQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a9c2e6407eba7555329515df54aeedaf",
    "id": null,
    "metadata": {},
    "name": "QcPageQuery",
    "operationKind": "query",
    "text": "query QcPageQuery(\n  $ids: [ID!]!\n) {\n  clipsByOldClipIds(oldClipIds: $ids) {\n    id\n    title\n    owner\n    client\n    oldClipId\n  }\n}\n"
  }
};
})();

(node as any).hash = "b2f01071786df67fbd59eb7b98a0a7a2";

export default node;
