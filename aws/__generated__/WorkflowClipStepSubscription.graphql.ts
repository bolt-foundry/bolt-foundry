/**
 * @generated SignedSource<<30e8d75c8f05acfdc2d6f52255666e52>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WorkflowClipStepSubscription$variables = {
  id: string;
};
export type WorkflowClipStepSubscription$data = {
  readonly project: {
    readonly " $fragmentSpreads": FragmentRefs<"WorkflowClipStep_project">;
  } | null | undefined;
};
export type WorkflowClipStepSubscription = {
  response: WorkflowClipStepSubscription$data;
  variables: WorkflowClipStepSubscription$variables;
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
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkflowClipStepSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "WorkflowClipStep_project"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WorkflowClipStepSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "transcriptLength",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ClipsStatus",
            "kind": "LinkedField",
            "name": "clipsStatus",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "progress",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "status",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "clipsLength",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "66234be930c01f64a37a2b17f47db96a",
    "id": null,
    "metadata": {},
    "name": "WorkflowClipStepSubscription",
    "operationKind": "subscription",
    "text": "subscription WorkflowClipStepSubscription(\n  $id: ID!\n) {\n  project(id: $id) {\n    ...WorkflowClipStep_project\n    id\n  }\n}\n\nfragment WorkflowClipStep_project on Project {\n  id\n  transcriptLength\n  clipsStatus {\n    progress\n    status\n  }\n  clipsLength\n}\n"
  }
};
})();

(node as any).hash = "54196d61508d27fdfb109f06e313aca8";

export default node;
