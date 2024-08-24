import { CallbackManagerForChainRun, Callbacks } from "../../callbacks/manager.d.ts";
import { BaseChain, ChainInputs } from "../../chains/base.d.ts";
import { ChainValues } from "../../schema/index.d.ts";
type Inputs = {
    [key: string]: Inputs | Inputs[] | string | string[] | number | number[];
};
export interface Route {
    destination?: string;
    nextInputs: {
        [key: string]: Inputs;
    };
}
export interface MultiRouteChainInput extends ChainInputs {
    routerChain: RouterChain;
    destinationChains: {
        [name: string]: BaseChain;
    };
    defaultChain: BaseChain;
    silentErrors?: boolean;
}
export declare abstract class RouterChain extends BaseChain {
    get outputKeys(): string[];
    route(inputs: ChainValues, callbacks?: Callbacks): Promise<Route>;
}
export declare class MultiRouteChain extends BaseChain {
    routerChain: RouterChain;
    destinationChains: {
        [name: string]: BaseChain;
    };
    defaultChain: BaseChain;
    silentErrors: boolean;
    constructor(fields: MultiRouteChainInput);
    get inputKeys(): string[];
    get outputKeys(): string[];
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    _chainType(): string;
}
export {};
