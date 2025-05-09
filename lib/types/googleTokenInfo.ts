/**
 * Interface representing the response from Google's tokeninfo endpoint
 * https://oauth2.googleapis.com/tokeninfo
 */
export interface GoogleTokenInfo {
  /** The user's email address */
  email: string;

  /** Whether the email is verified */
  email_verified: boolean;

  /** The user's Google ID (subject identifier) */
  sub: string;

  /** The audience that the token was issued to */
  aud?: string;

  /** The issuer of the token */
  iss?: string;

  /** When the token expires (in seconds since the Unix epoch) */
  exp?: string;

  /** The time the token was issued (in seconds since the Unix epoch) */
  iat?: string;

  /** The user's full name (if available) */
  name?: string;

  /** The user's profile picture URL (if available) */
  picture?: string;

  /** The user's given name (if available) */
  given_name?: string;

  /** The user's family name (if available) */
  family_name?: string;

  /** The hosted G Suite domain (if the user belongs to a G Suite domain) */
  hd?: string;

  /** The scopes that the token has access to */
  scope?: string;
}
