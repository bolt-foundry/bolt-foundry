/**
 * @generated SignedSource<<b6f9daed576ef4006fbb73063e26081c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UserProfileSwitchAccountMutation$variables = {
  accountId: string;
};
export type UserProfileSwitchAccountMutation$data = {
  readonly switchAccount: {
    readonly actor: {
      readonly name: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type UserProfileSwitchAccountMutation = {
  response: UserProfileSwitchAccountMutation$data;
  variables: UserProfileSwitchAccountMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "accountId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "accountId",
    "variableName": "accountId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UserProfileSwitchAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfCurrentViewerAccessToken",
        "kind": "LinkedField",
        "name": "switchAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
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
    "name": "UserProfileSwitchAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "BfCurrentViewerAccessToken",
        "kind": "LinkedField",
        "name": "switchAccount",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "actor",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "62a3c3f0d17bf26be903098e52d2099f",
    "id": null,
    "metadata": {},
    "name": "UserProfileSwitchAccountMutation",
    "operationKind": "mutation",
    "text": "mutation UserProfileSwitchAccountMutation(\n  $accountId: ID!\n) {\n  switchAccount(accountId: $accountId) {\n    actor {\n      __typename\n      name\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0960a6ff722a04d08d54ffc94be69b5a";

export default node;
