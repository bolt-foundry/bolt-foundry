import camelcaseKeys from 'camelcase-keys';
// twirp RPC adapter for client implementation
const defaultPrefix = '/twirp';
export const livekitPackage = 'livekit';
/**
 * JSON based Twirp V7 RPC
 */
export class TwirpRpc {
    constructor(host, pkg, prefix) {
        if (host.startsWith('ws')) {
            host = host.replace('ws', 'http');
        }
        this.host = host;
        this.pkg = pkg;
        this.prefix = prefix || defaultPrefix;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request(service, method, data, headers) {
        const path = `${this.prefix}/${this.pkg}.${service}/${method}`;
        const url = new URL(path, this.host);
        const response = await fetch(url, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json;charset=UTF-8' }, headers),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        }
        const parsedResp = await response.json();
        return camelcaseKeys(parsedResp, { deep: true });
    }
}
//# sourceMappingURL=TwirpRPC.js.map