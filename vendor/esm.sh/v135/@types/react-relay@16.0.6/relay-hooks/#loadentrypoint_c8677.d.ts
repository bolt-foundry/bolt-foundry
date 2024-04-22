import { EnvironmentProviderOptions, IEnvironmentProvider, PreloadedEntryPoint } from "./EntryPointTypes.d.ts";
import { GetEntryPointComponentFromEntryPoint, GetEntryPointParamsFromEntryPoint } from "./helpers.d.ts";

export function loadEntryPoint<TEntryPoint>(
    environmentProvider: IEnvironmentProvider<EnvironmentProviderOptions>,
    entryPoint: TEntryPoint,
    entryPointParams: GetEntryPointParamsFromEntryPoint<TEntryPoint>,
): PreloadedEntryPoint<GetEntryPointComponentFromEntryPoint<TEntryPoint>>;
