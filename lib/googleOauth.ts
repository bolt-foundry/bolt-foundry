import { OAuth2Client } from "npm:google-auth-library@9.2.0";
import { BfError } from "lib/BfError.ts";
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_OAUTH_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_OAUTH_CLIENT_ID = Deno.env.get("GOOGLE_OAUTH_CLIENT_ID");
const GOOGLE_OAUTH_REDIRECT_URL = Deno.env.get("GOOGLE_OAUTH_REDIRECT_URL");
const GOOGLE_OAUTH_CLIENT_SECRET = Deno.env.get("GOOGLE_OAUTH_CLIENT_SECRET");

if (!GOOGLE_OAUTH_CLIENT_ID) {
  throw new BfError("Missing GOOGLE_OAUTH_CLIENT_ID");
}
if (!GOOGLE_OAUTH_REDIRECT_URL) {
  throw new BfError("Missing GOOGLE_OAUTH_REDIRECT_URL");
}
if (!GOOGLE_OAUTH_CLIENT_SECRET) {
  throw new BfError("Missing GOOGLE_OAUTH_CLIENT_SECRET");
}

export function getGoogleOauthUrl() {
  const paramsInit = {
    scope: "https://www.googleapis.com/auth/drive.file",
    access_type: "offline",
    include_granted_scopes: "true",
    response_type: "code",
    prompt: "consent",
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URL!,
    client_id: GOOGLE_OAUTH_CLIENT_ID!,
  };
  const params = new URLSearchParams(paramsInit);
  return `${GOOGLE_OAUTH_ENDPOINT}?${params}`;
}

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
};

export async function exchangeCodeForToken(
  code: string,
): Promise<GoogleTokenResponse> {
  const params = new URLSearchParams({
    code,
    client_id: GOOGLE_OAUTH_CLIENT_ID!,
    client_secret: GOOGLE_OAUTH_CLIENT_SECRET!,
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URL!,
    grant_type: "authorization_code",
  });
  const res = await fetch(GOOGLE_OAUTH_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  return await res.json();
}

export async function exchangeRefreshTokenForAccessToken(refreshToken: string) {
  const oauth2Client = new OAuth2Client(
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URL,
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const response = await oauth2Client.getAccessToken();
  return response.res?.data as GoogleTokenResponse;
}

export const oauth2Client = new OAuth2Client(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URL,
);
