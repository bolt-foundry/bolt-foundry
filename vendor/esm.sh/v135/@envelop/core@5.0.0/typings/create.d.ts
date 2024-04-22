import { ComposeContext, GetEnvelopedFn, Optional, Plugin } from 'https://esm.sh/v135/@envelop/types@5.0.0/typings/index.d.ts';
type ExcludeFalsy<TArray extends any[]> = Exclude<TArray[0], null | undefined | false>[];
export declare function envelop<PluginsType extends Optional<Plugin<any>>[]>(options: {
    plugins: PluginsType;
    enableInternalTracing?: boolean;
}): GetEnvelopedFn<ComposeContext<ExcludeFalsy<PluginsType>>>;
export {};
