/**
 * @generated SignedSource<<14ebff7773fc9a5f42262a060a23a50d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import * as _____client_relay_localResolvers_ProjectResolver from "aws/client/relay/localResolvers/ProjectResolver.ts";
import { FragmentRefs } from "relay-runtime";
import { opurl as projectOpurlResolverType } from "../client/relay/localResolvers/ProjectResolver.ts";
export type WorkflowTranscribeStep_project$data = {
  readonly id: string | null | undefined;
  readonly opurl: string | null | undefined;
  readonly transcripts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly transcriptLength: number | null | undefined;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly videoUrl: string | null | undefined;
  readonly " $fragmentType": "WorkflowTranscribeStep_project";
};
export type WorkflowTranscribeStep_project$key = {
  readonly " $data"?: WorkflowTranscribeStep_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"WorkflowTranscribeStep_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkflowTranscribeStep_project",
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "transcriptLength",
                  "storageKey": null
                }
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
      "alias": null,
      "args": null,
      "fragment": {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ProjectResolverOpurlResolver"
      },
      "kind": "RelayResolver",
      "name": "opurl",
      "resolverModule": _____client_relay_localResolvers_ProjectResolver.opurl,
      "path": "opurl"
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "4bc623c418c69897a769b04f287bad07";

export default node;
