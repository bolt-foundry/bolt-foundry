/**
 * @generated SignedSource<<f3a53d77a22b9e72ef26a6564dd1b3ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectResolverOpurlResolver$data = {
  readonly id: string | null | undefined;
  readonly " $fragmentType": "ProjectResolverOpurlResolver";
};
export type ProjectResolverOpurlResolver$key = {
  readonly " $data"?: ProjectResolverOpurlResolver$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectResolverOpurlResolver">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectResolverOpurlResolver",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "935c81e04711fa9f541564ea205ec506";

export default node;
