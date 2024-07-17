/**
 * @generated SignedSource<<db274378db3c0070d47ebe1b1788efc4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type PlaygroundPageMutation$variables = {
  input: string;
};
export type PlaygroundPageMutation$data = {
  readonly playgroundMutation: {
    readonly message: string | null | undefined;
    readonly success: boolean;
  } | null | undefined;
};
export type PlaygroundPageMutation = {
  response: PlaygroundPageMutation$data;
  variables: PlaygroundPageMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "PlaygroundMutationPayload",
    "kind": "LinkedField",
    "name": "playgroundMutation",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "message",
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
    "name": "PlaygroundPageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PlaygroundPageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "376383a7c62854850480f79f4665f236",
    "id": null,
    "metadata": {},
    "name": "PlaygroundPageMutation",
    "operationKind": "mutation",
    "text": "mutation PlaygroundPageMutation(\n  $input: String!\n) {\n  playgroundMutation(input: $input) {\n    success\n    message\n  }\n}\n"
  }
};
})();

(node as any).hash = "44171af1e6b2cb05217f4fb6ce227d95";

export default node;
