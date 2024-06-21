/**
 * @generated SignedSource<<f0b0c89f4ec9c5607a88f46a2b649a38>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ManualCropMenuMutation$variables = {
  id: string;
  manualCrop: string;
  manualCropActive: boolean;
};
export type ManualCropMenuMutation$data = {
  readonly updateClip: {
    readonly manualCrop: string | null | undefined;
    readonly manualCropActive: boolean | null | undefined;
  } | null | undefined;
};
export type ManualCropMenuMutation = {
  response: ManualCropMenuMutation$data;
  variables: ManualCropMenuMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "manualCrop"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "manualCropActive"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  },
  {
    "kind": "Variable",
    "name": "manualCrop",
    "variableName": "manualCrop"
  },
  {
    "kind": "Variable",
    "name": "manualCropActive",
    "variableName": "manualCropActive"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCrop",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "manualCropActive",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ManualCropMenuMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Clip",
        "kind": "LinkedField",
        "name": "updateClip",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ManualCropMenuMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Clip",
        "kind": "LinkedField",
        "name": "updateClip",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
    "cacheID": "1c3b7407424e4e9a5f543d5fb45cd88c",
    "id": null,
    "metadata": {},
    "name": "ManualCropMenuMutation",
    "operationKind": "mutation",
    "text": "mutation ManualCropMenuMutation(\n  $id: ID!\n  $manualCrop: String!\n  $manualCropActive: Boolean!\n) {\n  updateClip(id: $id, manualCrop: $manualCrop, manualCropActive: $manualCropActive) {\n    manualCrop\n    manualCropActive\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "03b91ff9430bcab6c8aed5aaacc5a729";

export default node;
