import { ReactElement } from "https://esm.sh/v128/@types/react@18.2.38/index.d.ts";
import { EntryPointComponent, PreloadedEntryPoint } from "./EntryPointTypes.d.ts";

type GetComponentFromPreloadedEntryPoint<T> = T extends PreloadedEntryPoint<infer C> ? C : never;
type GetRuntimePropsFromComponent<T> = T extends EntryPointComponent<any, any, infer R, any> ? R : never;

export function EntryPointContainer<TPreloadedEntryPoint extends PreloadedEntryPoint<any>>({
    entryPointReference,
    props,
}: Readonly<{
    entryPointReference: TPreloadedEntryPoint;
    props: GetRuntimePropsFromComponent<GetComponentFromPreloadedEntryPoint<TPreloadedEntryPoint>>;
}>): ReactElement;

export {};
