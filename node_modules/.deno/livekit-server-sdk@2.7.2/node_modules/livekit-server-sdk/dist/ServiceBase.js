// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { AccessToken } from './AccessToken.js';
/**
 * Utilities to handle authentication
 */
export default class ServiceBase {
    /**
     * @param apiKey - API Key.
     * @param secret - API Secret.
     * @param ttl - token TTL
     */
    constructor(apiKey, secret, ttl) {
        this.apiKey = apiKey;
        this.secret = secret;
        this.ttl = ttl || '10m';
    }
    async authHeader(grant, sip) {
        const at = new AccessToken(this.apiKey, this.secret, { ttl: this.ttl });
        at.addGrant(grant);
        if (sip) {
            at.addSIPGrant(sip);
        }
        return {
            Authorization: `Bearer ${await at.toJwt()}`,
        };
    }
}
//# sourceMappingURL=ServiceBase.js.map