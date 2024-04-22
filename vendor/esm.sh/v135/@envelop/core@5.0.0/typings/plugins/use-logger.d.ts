import { Plugin } from 'https://esm.sh/v135/@envelop/types@5.0.0/typings/index.d.ts';
import { envelopIsIntrospectionSymbol } from '../utils.d.ts';
type LoggerPluginOptions = {
    logFn: typeof console.log;
    skipIntrospection?: boolean;
};
type InternalPluginContext = {
    [envelopIsIntrospectionSymbol]?: true;
};
export declare const useLogger: (rawOptions?: LoggerPluginOptions) => Plugin<InternalPluginContext>;
export {};
