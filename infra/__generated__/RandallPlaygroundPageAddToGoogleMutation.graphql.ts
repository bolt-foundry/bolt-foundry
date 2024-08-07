/**
 * @generated SignedSource<<38b7307bc5c4df22269a3e58485d20c1>>
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
      readonly googleAuthAccessToken: string | null | undefined;
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
  "kind": "ScalarField",
  "name": "googleAuthAccessToken",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
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
          {
            "alias": null,
            "args": null,
            "concreteType": "BfPerson",
            "kind": "LinkedField",
            "name": "person",
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5e1cdf1d1521f8e4986090b1189f1814",
    "id": null,
    "metadata": {},
    "name": "RandallPlaygroundPageAddToGoogleMutation",
    "operationKind": "mutation",
    "text": "mutation RandallPlaygroundPageAddToGoogleMutation(\n  $code: String!\n) {\n  linkAdvancedGoogleAuth(code: $code) {\n    __typename\n    __isBfCurrentViewer: __typename\n    person {\n      googleAuthAccessToken\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "34eff8db39623b64ba4379a67263bfa1";

export default node;
