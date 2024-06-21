/**
 * @generated SignedSource<<f21a9d199ae23925b760ad7c82cd3104>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ClipEditEncodeClipMutation$variables = {
  id: string;
};
export type ClipEditEncodeClipMutation$data = {
  readonly encodeClip: {
    readonly id: string | null | undefined;
  } | null | undefined;
};
export type ClipEditEncodeClipMutation = {
  response: ClipEditEncodeClipMutation$data;
  variables: ClipEditEncodeClipMutation$variables;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Clip",
    "kind": "LinkedField",
    "name": "encodeClip",
    "plural": false,
    "selections": [
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ClipEditEncodeClipMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ClipEditEncodeClipMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e1c6b4206e4425ae164f418b49478596",
    "id": null,
    "metadata": {},
    "name": "ClipEditEncodeClipMutation",
    "operationKind": "mutation",
    "text": "mutation ClipEditEncodeClipMutation(\n  $id: ID!\n) {\n  encodeClip(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "3d715b7835ea1e57a37d24f11711bcee";

export default node;
