/**
 * @generated SignedSource<<1d31635b229e1f4e4db64c217ff0de14>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RandallPlaygroundPageAddToGoogleMutation$variables = {
  code: string;
};
export type RandallPlaygroundPageAddToGoogleMutation$data = {
  readonly linkAdvancedGoogleAuth: {
    readonly person: {
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type RandallPlaygroundPageAddToGoogleMutation = {
  response: RandallPlaygroundPageAddToGoogleMutation$data;
  variables: RandallPlaygroundPageAddToGoogleMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "code"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "code",
    "variableName": "code"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "BfPerson",
  "kind": "LinkedField",
  "name": "person",
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RandallPlaygroundPageAddToGoogleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "linkAdvancedGoogleAuth",
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
    "name": "RandallPlaygroundPageAddToGoogleMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "linkAdvancedGoogleAuth",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isBfCurrentViewer"
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2f2e578c26efc1553c145dfa56fa63c5",
    "id": null,
    "metadata": {},
    "name": "RandallPlaygroundPageAddToGoogleMutation",
    "operationKind": "mutation",
    "text": "mutation RandallPlaygroundPageAddToGoogleMutation(\n  $code: String!\n) {\n  linkAdvancedGoogleAuth(code: $code) {\n    __typename\n    __isBfCurrentViewer: __typename\n    person {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "74aa7802e444fb0559d33b9858dd9945";

export default node;
