/**
 * @generated SignedSource<<062e4fa7951159d24f4e6c87210371d6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type OrganizationSwitcherSubscription$variables = {
  id: string;
};
export type OrganizationSwitcherSubscription$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"OrganizationSwitcher_bfOrganization">;
  } | null | undefined;
};
export type OrganizationSwitcherSubscription = {
  response: OrganizationSwitcherSubscription$data;
  variables: OrganizationSwitcherSubscription$variables;
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
    "name": "OrganizationSwitcherSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OrganizationSwitcher_bfOrganization"
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
    "name": "OrganizationSwitcherSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              }
            ],
            "type": "BfOrganization",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "09d737d491c1034c88e2b626a22e010a",
    "id": null,
    "metadata": {},
    "name": "OrganizationSwitcherSubscription",
    "operationKind": "subscription",
    "text": "subscription OrganizationSwitcherSubscription(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...OrganizationSwitcher_bfOrganization\n    id\n  }\n}\n\nfragment OrganizationSwitcher_bfOrganization on BfOrganization {\n  name\n  id\n}\n"
  }
};
})();

(node as any).hash = "e97e42cbe181f391099b2aef8ff09c59";

export default node;
