import type { Args } from './Args.js';
import type { MaybeThunk } from './core/helpers.js';
import type { Hybrid } from './Hybrid/__.js';
import type { Output } from './Output/__.js';
export type Field<$Type extends Output.Any, $Args extends Args<any> | null> = {
    type: $Type;
    args: $Args;
};
export declare const field: <$Type extends Output.Any, $Args extends null | Args<any> = null>(type: MaybeThunk<$Type>, args?: $Args) => Field<$Type, $Args>;
export type SomeField = Field<Hybrid.Enum | Hybrid.Scalar.Any | Output.List<any> | Output.Nullable<any> | Output.Object$2<string, any> | Output.Union<string, [any, ...any[]]> | Output.Interface<string, Record<string, Field<any, Args<any> | null>>, [any, ...any[]]>, Args<any> | null>;
export type SomeFields<$Keys extends string | number | symbol = string | number | symbol> = Record<$Keys, SomeField>;
//# sourceMappingURL=Field.d.ts.map