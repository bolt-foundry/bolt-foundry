import { FetchFunction, Network, SubscribeFunction } from "./RelayNetworkTypes.d.ts";

export const RelayNetwork: {
    create(fetchFn: FetchFunction, subscribeFn?: SubscribeFunction): Network;
};
