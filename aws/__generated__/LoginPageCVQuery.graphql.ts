/**
 * @generated SignedSource<<51fdd560c25d855e37e962a967b13bd2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
export type LoginPageCVQuery$variables = Record<PropertyKey, never>;
export type LoginPageCVQuery$data = {
  readonly currentViewer:
    | {
      readonly person:
        | {
          readonly name: string | null | undefined;
        }
        | null
        | undefined;
    }
    | null
    | undefined;
};
export type LoginPageCVQuery = {
  response: LoginPageCVQuery$data;
  variables: LoginPageCVQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null,
  };
  return {
    "fragment": {
      "argumentDefinitions": [],
      "kind": "Fragment",
      "metadata": null,
      "name": "LoginPageCVQuery",
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "currentViewer",
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
                v0, /*: any*/
              ],
              "storageKey": null,
            },
          ],
          "storageKey": null,
        },
      ],
      "type": "Query",
      "abstractKey": null,
    },
    "kind": "Request",
    "operation": {
      "argumentDefinitions": [],
      "kind": "Operation",
      "name": "LoginPageCVQuery",
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": null,
          "kind": "LinkedField",
          "name": "currentViewer",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__typename",
              "storageKey": null,
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "BfPerson",
              "kind": "LinkedField",
              "name": "person",
              "plural": false,
              "selections": [
                v0, /*: any*/
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null,
                },
              ],
              "storageKey": null,
            },
          ],
          "storageKey": null,
        },
      ],
    },
    "params": {
      "cacheID": "b40c371dfa00b171d4dac841d1712d61",
      "id": null,
      "metadata": {},
      "name": "LoginPageCVQuery",
      "operationKind": "query",
      "text":
        "query LoginPageCVQuery {\n  currentViewer {\n    __typename\n    person {\n      name\n      id\n    }\n  }\n}\n",
    },
  };
})();

(node as any).hash = "3a94e3886b5bc2b401422a32298f21f8";

export default node;
