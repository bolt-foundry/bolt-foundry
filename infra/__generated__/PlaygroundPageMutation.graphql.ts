/**
 * @generated SignedSource<<08a92fc2298fbb5833399ca12a1c00d3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type PlaygroundPageMutation$variables = {
  input: string;
  suggestedModel?: string | null | undefined;
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "suggestedModel"
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
      },
      {
        "kind": "Variable",
        "name": "suggestedModel",
        "variableName": "suggestedModel"
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
    "cacheID": "db61ade9e790df8994e7e65a073e0e91",
    "id": null,
    "metadata": {},
    "name": "PlaygroundPageMutation",
    "operationKind": "mutation",
    "text": "mutation PlaygroundPageMutation(\n  $input: String!\n  $suggestedModel: String\n) {\n  playgroundMutation(input: $input, suggestedModel: $suggestedModel) {\n    success\n    message\n  }\n}\n"
  }
};
})();

(node as any).hash = "9bffeb16094c65e990daf17f5e128778";

export default node;
