/**
 * @generated SignedSource<<a31545e120988ce5ff76ba4eb3328b93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IBfOrganizationsPageQuery$variables = Record<PropertyKey, never>;
export type IBfOrganizationsPageQuery$data = {
  readonly organizations: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"IBfOrganizationsPage_BfOrganization">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type IBfOrganizationsPageQuery = {
  response: IBfOrganizationsPageQuery$data;
  variables: IBfOrganizationsPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IBfOrganizationsPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "BfOrganizationConnection",
        "kind": "LinkedField",
        "name": "organizations",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BfOrganizationEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BfOrganization",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "IBfOrganizationsPage_BfOrganization"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "organizations(first:10)"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IBfOrganizationsPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "BfOrganizationConnection",
        "kind": "LinkedField",
        "name": "organizations",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "BfOrganizationEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BfOrganization",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
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
        ],
        "storageKey": "organizations(first:10)"
      }
    ]
  },
  "params": {
    "cacheID": "ccf18bc85f38ba825cb38e3444e00900",
    "id": null,
    "metadata": {},
    "name": "IBfOrganizationsPageQuery",
    "operationKind": "query",
    "text": "query IBfOrganizationsPageQuery {\n  organizations(first: 10) {\n    edges {\n      node {\n        ...IBfOrganizationsPage_BfOrganization\n        id\n      }\n    }\n  }\n}\n\nfragment IBfOrganizationsPage_BfOrganization on BfOrganization {\n  name\n}\n"
  }
};
})();

(node as any).hash = "f6cbe5d079da7138cb311f523fdcbf2b";

export default node;
