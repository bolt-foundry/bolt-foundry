/**
 * @generated SignedSource<<809a55592f2fb29534867a47859d79cf>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type TriviaTaxiCreateTTGameMutation$variables = {
  shouldCreate: boolean;
};
export type TriviaTaxiCreateTTGameMutation$data = {
  readonly createTTGame: {
    readonly id: string;
  } | null | undefined;
};
export type TriviaTaxiCreateTTGameMutation = {
  response: TriviaTaxiCreateTTGameMutation$data;
  variables: TriviaTaxiCreateTTGameMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "shouldCreate"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "shouldCreate",
        "variableName": "shouldCreate"
      }
    ],
    "concreteType": "BfTTGame",
    "kind": "LinkedField",
    "name": "createTTGame",
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
    "name": "TriviaTaxiCreateTTGameMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TriviaTaxiCreateTTGameMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "44b1e7912be372e37c4a2532f61dbe53",
    "id": null,
    "metadata": {},
    "name": "TriviaTaxiCreateTTGameMutation",
    "operationKind": "mutation",
    "text": "mutation TriviaTaxiCreateTTGameMutation(\n  $shouldCreate: Boolean!\n) {\n  createTTGame(shouldCreate: $shouldCreate) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "da9a539c928bba7ec1a626c1dc11102b";

export default node;
