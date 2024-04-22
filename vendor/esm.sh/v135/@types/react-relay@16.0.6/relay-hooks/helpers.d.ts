/*
A TS file to help with the construction of the official Relay (flow) types.
 */

import { FragmentType } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
import { EntryPoint } from "./EntryPointTypes.d.ts";

export type KeyType<TData = unknown> = Readonly<{
    " $data"?: TData | undefined;
    " $fragmentSpreads": FragmentType;
}>;

export type KeyTypeData<TKey extends KeyType<TData>, TData = unknown> = Required<TKey>[" $data"];

export type ArrayKeyType<TData = unknown> = ReadonlyArray<KeyType<readonly TData[]> | null | undefined>;
export type ArrayKeyTypeData<TKey extends ArrayKeyType<TData>, TData = unknown> = KeyTypeData<
    NonNullable<TKey[number]>
>;

export type GetEntryPointParamsFromEntryPoint<TEntryPoint> = TEntryPoint extends EntryPoint<
    infer TEntryPointComponent,
    infer TEntryPointParams
> ? TEntryPointParams
    : never;

export type GetEntryPointComponentFromEntryPoint<TEntryPoint> = TEntryPoint extends EntryPoint<
    infer TEntryPointComponent,
    infer TEntryPointParams
> ? TEntryPointComponent
    : never;
