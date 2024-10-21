import type { JsonValue } from '@bufbuild/protobuf';
export declare const livekitPackage = "livekit";
export interface Rpc {
    request(service: string, method: string, data: JsonValue, headers?: any): Promise<string>;
}
/**
 * JSON based Twirp V7 RPC
 */
export declare class TwirpRpc {
    host: string;
    pkg: string;
    prefix: string;
    constructor(host: string, pkg: string, prefix?: string);
    request(service: string, method: string, data: any, headers?: any): Promise<any>;
}
//# sourceMappingURL=TwirpRPC.d.ts.map