import { getJupyterCurrentViewer } from "infra/lib/jupyterUtils.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";
import { BfMedia } from "packages/bfDb/models/BfMedia.ts";

const cv = await getJupyterCurrentViewer()
const currentOrg = await BfOrganization.findX(cv, cv.organizationBfGid);
const bfMedias = await currentOrg.queryTargetInstances(BfMedia)