import { BaseExternalAccountClient } from './baseexternalclient.d.ts';
import { IdentityPoolClientOptions } from './identitypoolclient.d.ts';
import { AwsClientOptions } from './awsclient.d.ts';
import { PluggableAuthClientOptions } from './pluggable-auth-client.d.ts';
import { AuthClientOptions } from './authclient.d.ts';
export type ExternalAccountClientOptions = IdentityPoolClientOptions | AwsClientOptions | PluggableAuthClientOptions;
/**
 * Dummy class with no constructor. Developers are expected to use fromJSON.
 */
export declare class ExternalAccountClient {
    constructor();
    /**
     * This static method will instantiate the
     * corresponding type of external account credential depending on the
     * underlying credential source.
     * @param options The external account options object typically loaded
     *   from the external account JSON credential file.
     * @param additionalOptions **DEPRECATED, all options are available in the
     *   `options` parameter.** Optional additional behavior customization options.
     *   These currently customize expiration threshold time and whether to retry
     *   on 401/403 API request errors.
     * @return A BaseExternalAccountClient instance or null if the options
     *   provided do not correspond to an external account credential.
     */
    static fromJSON(options: ExternalAccountClientOptions, additionalOptions?: AuthClientOptions): BaseExternalAccountClient | null;
}
