import { DisposeFn } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
import { EnvironmentProviderOptions, IEnvironmentProvider, PreloadedEntryPoint } from "./EntryPointTypes.d.ts";
import { GetEntryPointComponentFromEntryPoint, GetEntryPointParamsFromEntryPoint } from "./helpers.d.ts";

export type UseEntryPointLoaderHookType<TEntryPoint> = [
    PreloadedEntryPoint<GetEntryPointComponentFromEntryPoint<TEntryPoint>> | null | undefined,
    (entryPointParams: GetEntryPointParamsFromEntryPoint<TEntryPoint>) => void,
    DisposeFn,
];

export function useEntryPointLoader<TEntryPoint>(
    environmentProvider: IEnvironmentProvider<EnvironmentProviderOptions>,
    entryPoint: TEntryPoint,
    // Have opted to not include the TEST_ONLY__initialEntryPointData object here—as is FB internal
): UseEntryPointLoaderHookType<TEntryPoint>;
