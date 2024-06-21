/**
 * @generated SignedSource<<a95a37b2dfc2a1272f38b4ab5c58183d>>
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
export type FileUpload_project$data = {
  readonly id: string | null | undefined;
  readonly opurl: string | null | undefined;
  readonly " $fragmentType": "FileUpload_project";
};
export type FileUpload_project$key = {
  readonly " $data"?: FileUpload_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"FileUpload_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FileUpload_project",
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

(node as any).hash = "b2663f4967f63e6bfdb661a777660926";

export default node;
