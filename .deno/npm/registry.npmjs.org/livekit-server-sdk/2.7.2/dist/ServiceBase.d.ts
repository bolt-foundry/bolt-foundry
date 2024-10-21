import type { SIPGrant, VideoGrant } from './grants.js';
/**
 * Utilities to handle authentication
 */
export default class ServiceBase {
    private readonly apiKey?;
    private readonly secret?;
    private readonly ttl;
    /**
     * @param apiKey - API Key.
     * @param secret - API Secret.
     * @param ttl - token TTL
     */
    constructor(apiKey?: string, secret?: string, ttl?: string);
    authHeader(grant: VideoGrant, sip?: SIPGrant): Promise<Record<string, string>>;
}
//# sourceMappingURL=ServiceBase.d.ts.map