import type { JWK, JWTHeaderParameters, KeyLike, SignOptions } from '../types';
import { ProduceJWT } from './produce';
/**
 * The SignJWT class is used to build and sign Compact JWS formatted JSON Web Tokens.
 *
 * This class is exported (as a named export) from the main `'jose'` module entry point as well as
 * from its subpath export `'jose/jwt/sign'`.
 *
 */
export declare class SignJWT extends ProduceJWT {
    private _protectedHeader;
    /**
     * Sets the JWS Protected Header on the SignJWT object.
     *
     * @param protectedHeader JWS Protected Header. Must contain an "alg" (JWS Algorithm) property.
     */
    setProtectedHeader(protectedHeader: JWTHeaderParameters): this;
    /**
     * Signs and returns the JWT.
     *
     * @param key Private Key or Secret to sign the JWT with. See
     *   {@link https://github.com/panva/jose/issues/210#jws-alg Algorithm Key Requirements}.
     * @param options JWT Sign options.
     */
    sign(key: KeyLike | Uint8Array | JWK, options?: SignOptions): Promise<string>;
}
