import { getLogger } from "deps.ts";
import {
  BfAccount,
  BfAccountRequiredProps,
} from "packages/bfDb/models/BfAccount.ts";
import {
  BfCurrentViewerFromAccount,
  IBfCurrentViewerInternalAdminOmni,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { bfGetItemByBfGid } from "packages/bfDb/bfDb.ts";

const logger = getLogger(import.meta);

export async function getJupyterCurrentViewer(
  userId = Deno.env.get("JUPYTER_BFACCOUNT_BFGID"),
) {
  if (!userId) {
    logger.error("No JUPYTER_BFACCOUNT_BFGID");
    return null;
  }
  const accountRow = await bfGetItemByBfGid<BfAccountRequiredProps>(
    userId,
    BfAccount.name,
  );
  if (!accountRow) {
    logger.error("No account row for JUPYTER_BFACCOUNT_BFGID");
    return null;
  }

  const omniCv = IBfCurrentViewerInternalAdminOmni.__DANGEROUS__create(import.meta);
  const account = await BfAccount.findX(omniCv, accountRow.metadata.bfGid);

  logger.info(
    `${import.meta.url} - impersonating ${account.props.personBfGid}`,
  );
  return BfCurrentViewerFromAccount.create(import.meta, account);
}
