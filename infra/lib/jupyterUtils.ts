import { getLogger } from "deps.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import { BfCurrentViewerAccessToken } from "packages/bfDb/classes/BfCurrentViewer.ts";

const logger = getLogger(import.meta);

export async function getJupyterCurrentUser() {
  const refreshToken = Deno.env.get("JUPYTER_USER_REFRESH_TOKEN")
  const accessToken = await BfAccount.getRefreshedAccessToken(
    import.meta,
    refreshToken,
  );
  const currentViewer = await BfCurrentViewerAccessToken.create(import.meta, accessToken);
  logger.info(`${import.meta.url} - impersonating ${currentViewer.personBfGid}`);
  return currentViewer;
}
