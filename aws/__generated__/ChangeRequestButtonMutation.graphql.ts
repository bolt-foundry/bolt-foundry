/**
 * @generated SignedSource<<6f331fc68df07a82827d292d3d067045>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ChangeRequestButtonMutation$variables = {
  changeRequested: boolean;
  id: string;
};
export type ChangeRequestButtonMutation$data = {
  readonly updateClip: {
    readonly changeRequested: boolean | null | undefined;
  } | null | undefined;
};
export type ChangeRequestButtonMutation = {
  response: ChangeRequestButtonMutation$data;
  variables: ChangeRequestButtonMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "changeRequested"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "kind": "Variable",
    "name": "changeRequested",
    "variableName": "changeRequested"
  },
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "changeRequested",
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
    "name": "ChangeRequestButtonMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Clip",
        "kind": "LinkedField",
        "name": "updateClip",
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
    "name": "ChangeRequestButtonMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Clip",
        "kind": "LinkedField",
        "name": "updateClip",
        "plural": false,
        "selections": [
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
    "cacheID": "0745ed6e7580b231a97793e7c4d29743",
    "id": null,
    "metadata": {},
    "name": "ChangeRequestButtonMutation",
    "operationKind": "mutation",
    "text": "mutation ChangeRequestButtonMutation(\n  $id: ID!\n  $changeRequested: Boolean!\n) {\n  updateClip(id: $id, changeRequested: $changeRequested) {\n    changeRequested\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "6ebf045017a0c7253ccb0b411dbfd429";

export default node;
