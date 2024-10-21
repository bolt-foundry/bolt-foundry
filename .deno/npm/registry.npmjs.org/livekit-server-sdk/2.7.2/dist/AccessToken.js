// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import * as jose from 'jose';
import { claimsToJwtPayload } from './grants.js';
// 6 hours
const defaultTTL = `6h`;
export class AccessToken {
    /**
     * Creates a new AccessToken
     * @param apiKey - API Key, can be set in env LIVEKIT_API_KEY
     * @param apiSecret - Secret, can be set in env LIVEKIT_API_SECRET
     */
    constructor(apiKey, apiSecret, options) {
        if (!apiKey) {
            apiKey = process.env.LIVEKIT_API_KEY;
        }
        if (!apiSecret) {
            apiSecret = process.env.LIVEKIT_API_SECRET;
        }
        if (!apiKey || !apiSecret) {
            throw Error('api-key and api-secret must be set');
        }
        else if (typeof document !== 'undefined') {
            // check against document rather than window because deno provides window
            console.error('You should not include your API secret in your web client bundle.\n\n' +
                'Your web client should request a token from your backend server which should then use ' +
                'the API secret to generate a token. See https://docs.livekit.io/client/connect/');
        }
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.grants = {};
        this.identity = options === null || options === void 0 ? void 0 : options.identity;
        this.ttl = (options === null || options === void 0 ? void 0 : options.ttl) || defaultTTL;
        if (typeof this.ttl === 'number') {
            this.ttl = `${this.ttl}s`;
        }
        if (options === null || options === void 0 ? void 0 : options.metadata) {
            this.metadata = options.metadata;
        }
        if (options === null || options === void 0 ? void 0 : options.name) {
            this.name = options.name;
        }
    }
    /**
     * Adds a video grant to this token.
     * @param grant -
     */
    addGrant(grant) {
        var _a;
        this.grants.video = Object.assign(Object.assign({}, ((_a = this.grants.video) !== null && _a !== void 0 ? _a : {})), grant);
    }
    /**
     * Adds a SIP grant to this token.
     * @param grant -
     */
    addSIPGrant(grant) {
        var _a;
        this.grants.sip = Object.assign(Object.assign({}, ((_a = this.grants.sip) !== null && _a !== void 0 ? _a : {})), grant);
    }
    get name() {
        return this.grants.name;
    }
    set name(name) {
        this.grants.name = name;
    }
    get metadata() {
        return this.grants.metadata;
    }
    /**
     * Set metadata to be passed to the Participant, used only when joining the room
     */
    set metadata(md) {
        this.grants.metadata = md;
    }
    get attributes() {
        return this.grants.attributes;
    }
    set attributes(attrs) {
        this.grants.attributes = attrs;
    }
    get kind() {
        return this.grants.kind;
    }
    set kind(kind) {
        this.grants.kind = kind;
    }
    get sha256() {
        return this.grants.sha256;
    }
    set sha256(sha) {
        this.grants.sha256 = sha;
    }
    /**
     * @returns JWT encoded token
     */
    async toJwt() {
        // TODO: check for video grant validity
        var _a;
        const secret = new TextEncoder().encode(this.apiSecret);
        const jwt = new jose.SignJWT(claimsToJwtPayload(this.grants))
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuer(this.apiKey)
            .setExpirationTime(this.ttl)
            .setNotBefore(0);
        if (this.identity) {
            jwt.setSubject(this.identity);
        }
        else if ((_a = this.grants.video) === null || _a === void 0 ? void 0 : _a.roomJoin) {
            throw Error('identity is required for join but not set');
        }
        return jwt.sign(secret);
    }
}
export class TokenVerifier {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    async verify(token) {
        const secret = new TextEncoder().encode(this.apiSecret);
        const { payload } = await jose.jwtVerify(token, secret, { issuer: this.apiKey });
        if (!payload) {
            throw Error('invalid token');
        }
        return payload;
    }
}
//# sourceMappingURL=AccessToken.js.map