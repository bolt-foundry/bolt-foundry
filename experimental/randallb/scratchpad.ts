import { BfGoogleDriveResource } from "packages/bfDb/models/BfGoogleDriveResource.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";
import { BfMediaNodeVideoGoogleDriveResource } from "packages/bfDb/models/BfMediaNodeVideoGoogleDriveResource.ts";
const fileId = "1JX9Ia2wYHh-M8e6ykxSkoBAkIhHe7FUe";
const file = await BfGoogleDriveResource.findX(cv, fileId);
const bfMedias = await file.queryTargetInstances(BfMedia);
const bfm = bfMedias[0];
const bfMediaNodeVideoGoogleDriveResources = await bfm.queryTargetInstances(
  BfMediaNodeVideoGoogleDriveResource,
);
const bfmn = bfMediaNodeVideoGoogleDriveResources[0];

import { BfMediaNodeTranscript } from "packages/bfDb/models/BfMediaNodeTranscript.ts";
bfmn.queryTargetInstances(BfMediaNodeTranscript)