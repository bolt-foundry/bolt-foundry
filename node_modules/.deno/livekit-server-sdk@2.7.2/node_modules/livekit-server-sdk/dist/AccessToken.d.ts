import type { ClaimGrants, SIPGrant, VideoGrant } from './grants.js';
export interface AccessTokenOptions {
    /**
     * amount of time before expiration
     * expressed in seconds or a string describing a time span zeit/ms.
     * eg: '2 days', '10h', or seconds as numeric value
     */
    ttl?: number | string;
    /**
     * display name for the participant, available as `Participant.name`
     */
    name?: string;
    /**
     * identity of the user, required for room join tokens
     */
    identity?: string;
    /**
     * custom metadata to be passed to participants
     */
    metadata?: string;
}
export declare class AccessToken {
    private apiKey;
    private apiSecret;
    private grants;
    identity?: string;
    ttl: number | string;
    /**
     * Creates a new AccessToken
     * @param apiKey - API Key, can be set in env LIVEKIT_API_KEY
     * @param apiSecret - Secret, can be set in env LIVEKIT_API_SECRET
     */
    constructor(apiKey?: string, apiSecret?: string, options?: AccessTokenOptions);
    /**
     * Adds a video grant to this token.
     * @param grant -
     */
    addGrant(grant: VideoGrant): void;
    /**
     * Adds a SIP grant to this token.
     * @param grant -
     */
    addSIPGrant(grant: SIPGrant): void;
    get name(): string | undefined;
    set name(name: string);
    get metadata(): string | undefined;
    /**
     * Set metadata to be passed to the Participant, used only when joining the room
     */
    set metadata(md: string);
    get attributes(): Record<string, string> | undefined;
    set attributes(attrs: Record<string, string>);
    get kind(): string | undefined;
    set kind(kind: string);
    get sha256(): string | undefined;
    set sha256(sha: string | undefined);
    /**
     * @returns JWT encoded token
     */
    toJwt(): Promise<string>;
}
export declare class TokenVerifier {
    private apiKey;
    private apiSecret;
    constructor(apiKey: string, apiSecret: string);
    verify(token: string): Promise<ClaimGrants>;
}
//# sourceMappingURL=AccessToken.d.ts.map