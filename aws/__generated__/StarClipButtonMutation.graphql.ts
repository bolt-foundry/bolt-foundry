/**
 * @generated SignedSource<<629b4d958b86add4b6fd73918f6e7600>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type StarClipButtonMutation$variables = {
  id: string;
  starred: boolean;
};
export type StarClipButtonMutation$data = {
  readonly updateClip: {
    readonly isStarred: boolean | null | undefined;
  } | null | undefined;
};
export type StarClipButtonMutation = {
  response: StarClipButtonMutation$data;
  variables: StarClipButtonMutation$variables;
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
    "name": "starred"
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
    "name": "isStarred",
    "variableName": "starred"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isStarred",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "StarClipButtonMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Clip",
        "kind": "LinkedField",
        "name": "updateClip",
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
    "name": "StarClipButtonMutation",
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
    "cacheID": "1186122d844f1767effcf597c31e0315",
    "id": null,
    "metadata": {},
    "name": "StarClipButtonMutation",
    "operationKind": "mutation",
    "text": "mutation StarClipButtonMutation(\n  $id: ID!\n  $starred: Boolean!\n) {\n  updateClip(id: $id, isStarred: $starred) {\n    isStarred\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2ed6836351c938e81ebadb5108919e31";

export default node;
