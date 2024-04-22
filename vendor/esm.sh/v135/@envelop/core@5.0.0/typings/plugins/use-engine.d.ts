import { ExecuteFunction, ParseFunction, Plugin, SubscribeFunction, ValidateFunction } from 'https://esm.sh/v135/@envelop/types@5.0.0/typings/index.d.ts';
type UseEngineOptions = {
    execute?: ExecuteFunction;
    parse?: ParseFunction;
    validate?: ValidateFunction;
    specifiedRules?: readonly any[];
    subscribe?: SubscribeFunction;
};
export declare const useEngine: (engine: UseEngineOptions) => Plugin;
export {};
