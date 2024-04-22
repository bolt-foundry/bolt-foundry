import { GraphQLResponse } from "../network/RelayNetworkTypes.d.ts";
import { Variables } from "../util/RelayRuntimeTypes.d.ts";

export default class RelayQueryResponseCache {
    constructor(config: { size: number; ttl: number });
    clear(): void;
    get(queryID: string, variables: Variables): GraphQLResponse | null;
    set(queryID: string, variables: Variables, payload: GraphQLResponse): void;
}
