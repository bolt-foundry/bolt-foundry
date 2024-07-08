/**
 * @generated SignedSource<<a3c6b5f3e28090b73cb350411ecceec3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProjectTitle_project$data = {
  readonly id: string | null | undefined;
  readonly name: string | null | undefined;
  readonly " $fragmentType": "ProjectTitle_project";
};
export type ProjectTitle_project$key = {
  readonly " $data"?: ProjectTitle_project$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProjectTitle_project">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectTitle_project",
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
  "type": "Project",
  "abstractKey": null
};

(node as any).hash = "c59698319979f45e2e4d63c680068142";

export default node;
