/**
 * @generated SignedSource<<834a2109862522f5ea40d1bb3a2d9852>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type WorkflowTranscribeStepSubscription$variables = {
  id: string;
};
export type WorkflowTranscribeStepSubscription$data = {
  readonly project: {
    readonly transcripts: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly transcriptLength: number | null | undefined;
        } | null | undefined;
      } | null | undefined> | null | undefined;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"WorkflowTranscribeStep_project">;
  } | null | undefined;
};
export type WorkflowTranscribeStepSubscription = {
  response: WorkflowTranscribeStepSubscription$data;
  variables: WorkflowTranscribeStepSubscription$variables;
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
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "transcriptLength",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkflowTranscribeStepSubscription",
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
            "name": "WorkflowTranscribeStep_project"
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "TranscriptConnection",
            "kind": "LinkedField",
            "name": "transcripts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TranscriptEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Transcript",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "transcripts(first:1)"
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
    "name": "WorkflowTranscribeStepSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "project",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "TranscriptConnection",
            "kind": "LinkedField",
            "name": "transcripts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TranscriptEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Transcript",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "transcripts(first:1)"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "videoUrl",
            "storageKey": null
          },
          {
            "name": "opurl",
            "args": null,
            "fragment": {
              "kind": "InlineFragment",
              "selections": [
                (v4/*: any*/)
              ],
              "type": "Project",
              "abstractKey": null
            },
            "kind": "RelayResolver",
            "storageKey": null,
            "isOutputType": true
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "00731bd2302675d072a3ce9fed989f1a",
    "id": null,
    "metadata": {},
    "name": "WorkflowTranscribeStepSubscription",
    "operationKind": "subscription",
    "text": "subscription WorkflowTranscribeStepSubscription(\n  $id: ID!\n) {\n  project(id: $id) {\n    ...WorkflowTranscribeStep_project\n    transcripts(first: 1) {\n      edges {\n        node {\n          transcriptLength\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment ProjectResolverOpurlResolver on Project {\n  id\n}\n\nfragment WorkflowTranscribeStep_project on Project {\n  id\n  transcripts(first: 1) {\n    edges {\n      node {\n        transcriptLength\n        id\n      }\n    }\n  }\n  videoUrl\n  ...ProjectResolverOpurlResolver\n}\n"
  }
};
})();

(node as any).hash = "d4efbe0bdd6a08b30fc909c8bd2099c9";

export default node;
