import { GraphQLContext } from "packages/graphql/graphql.ts";
import { cookie } from "packages/graphql/deps.ts";
import {
  BfCurrentViewerAccessToken,
  BfCurrentViewerAnon,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

export async function getContextFromRequest(
  request: Request,
  CurrentViewerCreationClass: typeof BfCurrentViewerAccessToken = BfCurrentViewerAccessToken,
): Promise<GraphQLContext> {
  const cookies = cookie.getCookies(request.headers);
  const accessToken = cookies.BF_AT;
  const refreshToken = cookies.BF_RT;
  const responseHeaders = new Headers();
  logger.debug("Cookies: ", cookies);
  logger.debug({ accessToken, refreshToken });
  let bfCurrentViewer = await CurrentViewerCreationClass.create(
    import.meta,
    accessToken,
  );
  // startupBackend();
  if (bfCurrentViewer instanceof BfCurrentViewerAnon && refreshToken) {
    logger.debug("Found refresh token, refreshing access token");
    try {
      const nextAccessToken = await BfAccount.getRefreshedAccessToken(
        import.meta,
        refreshToken,
      );
      responseHeaders.append(
        "Set-Cookie",
        `BF_AT=${nextAccessToken}; HttpOnly; Path=/; Secure; SameSite=Strict`,
      );
      bfCurrentViewer = await BfCurrentViewerAccessToken.create(
        import.meta,
        nextAccessToken,
      );
    } catch (e) {
      logger.error("couldnt refresh access token", e);
      responseHeaders.append(
        "Set-Cookie",
        `BF_AT=; HttpOnly; Path=/; Secure; SameSite=Strict`,
      );
      responseHeaders.append(
        "Set-Cookie",
        `BF_RT=; HttpOnly; Path=/; Secure; SameSite=Strict`,
      );
      logger.error("Returning headers to delete auth cookies")
    }
  }
  return { bfCurrentViewer, responseHeaders };
}
