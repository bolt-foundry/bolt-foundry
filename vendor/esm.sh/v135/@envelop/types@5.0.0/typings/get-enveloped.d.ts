import { ExecuteFunction, ParseFunction, SubscribeFunction, ValidateFunction } from './graphql.d.ts';
import { Plugin } from './plugin.d.ts';
import { ArbitraryObject, PromiseOrValue, Spread } from './utils.d.ts';
export { ArbitraryObject } from './utils.d.ts';
export type EnvelopContextFnWrapper<TFunction extends Function, ContextType = unknown> = (context: ContextType) => TFunction;
export type GetEnvelopedFn<PluginsContext> = {
    <InitialContext extends ArbitraryObject>(initialContext?: InitialContext): {
        execute: ExecuteFunction;
        validate: ValidateFunction;
        subscribe: SubscribeFunction;
        parse: ParseFunction;
        contextFactory: <ContextExtension>(contextExtension?: ContextExtension) => PromiseOrValue<Spread<[InitialContext, PluginsContext, ContextExtension]>>;
        schema: any;
    };
    _plugins: Plugin[];
};
