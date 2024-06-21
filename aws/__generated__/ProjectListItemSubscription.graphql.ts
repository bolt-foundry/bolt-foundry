/**
 * @generated SignedSource<<868e5d95d7656b40a8aaad8f4f8ae7c3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectListItemSubscription$variables = {
  id: string;
};
export type ProjectListItemSubscription$data = {
  readonly project: {
    readonly " $fragmentSpreads": FragmentRefs<"ProjectListItem_Project">;
  } | null | undefined;
};
export type ProjectListItemSubscription = {
  response: ProjectListItemSubscription$data;
  variables: ProjectListItemSubscription$variables;
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
    "name": "ProjectListItemSubscription",
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
            "name": "ProjectListItem_Project"
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
    "name": "ProjectListItemSubscription",
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
            "name": "name",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "72ff54befd8fa2d3365d8b7443a79fdb",
    "id": null,
    "metadata": {},
    "name": "ProjectListItemSubscription",
    "operationKind": "subscription",
    "text": "subscription ProjectListItemSubscription(\n  $id: ID!\n) {\n  project(id: $id) {\n    ...ProjectListItem_Project\n    id\n  }\n}\n\nfragment ProjectListItem_Project on Project {\n  id\n  name\n}\n"
  }
};
})();

(node as any).hash = "fb60ccbcb146fb51556b8bca96d7e1b3";

export default node;
