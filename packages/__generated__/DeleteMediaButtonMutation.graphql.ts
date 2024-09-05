/**
 * @generated SignedSource<<f117fb5564892ced063959cdec1d5d9a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteMediaButtonMutation$variables = {
  id: string;
};
export type DeleteMediaButtonMutation$data = {
  readonly deleteMedia: {
    readonly id: string;
  } | null | undefined;
};
export type DeleteMediaButtonMutation = {
  response: DeleteMediaButtonMutation$data;
  variables: DeleteMediaButtonMutation$variables;
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
    "concreteType": "BfMedia",
    "kind": "LinkedField",
    "name": "deleteMedia",
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
    "name": "DeleteMediaButtonMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteMediaButtonMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ee3c19c2f32c954bb5409973daa5d6e8",
    "id": null,
    "metadata": {},
    "name": "DeleteMediaButtonMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteMediaButtonMutation(\n  $id: String!\n) {\n  deleteMedia(id: $id) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "2d6267571d3376a44d34f7cd29df3d5a";

export default node;
