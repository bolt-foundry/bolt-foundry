import { getJupyterCurrentViewer } from "infra/lib/jupyterUtils.ts";
const cv = await getJupyterCurrentViewer();
if (!cv) throw new Error();
import { getLogger } from "deps.ts";
const logger = getLogger("jupyter");
logger.setLevel(logger.levels.DEBUG);

///

///

import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfCollection } from "packages/bfDb/models/BfCollection.ts";

async function createCollectionMutation(
  bfCurrentViewer: BfCurrentViewer,
  name: string,
  googleDriveResourceFolderId: string,
) {
  const org = await BfOrganization.findForCurrentViewer(bfCurrentViewer);
  const collection = await org.createTargetNode(BfCollection, {
    name,
  });
  const watchedFolder = await collection.addWatchedFolder(
    googleDriveResourceFolderId,
  );
  // return collection.toGraphql();
  return collection;
}

import { cleanModels } from "packages/bfDb/utils.ts";

async function resetCollection(dryRun = false) {
  await cleanModels(
    ["BfMedia", "BfGoogleDriveResource", "BfCollection"],
    dryRun,
  );
}

///

const folderId = "1sq4gNo6pZ89xiu9hGD11o6z_9uoMI1Ka";
const name = "default";

await resetCollection();
const collection = await createCollectionMutation(cv, name, folderId);

///

const query = "docker";
const savedSearch = await collection.createSavedSearch(query);
savedSearch.metadata.bfGid;

///
import { BfSavedSearchResult } from "packages/bfDb/models/BfSavedSearchResult.ts";
import { BfSavedSearch } from "packages/bfDb/models/BfSavedSearch.ts";
const id = "0ca97092246f43c5ba10dcc56de0ef72";
const ss = await BfSavedSearch.findX(cv, id);
const results = await savedSearch.queryTargetsConnectionForGraphQL(
  BfSavedSearchResult,
  {},
);
