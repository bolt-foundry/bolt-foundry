import { ZodTupleDef, ZodTupleItems, ZodTypeAny } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
export type JsonSchema7TupleType = {
    type: "array";
    minItems: number;
    items: JsonSchema7Type[];
} & ({
    maxItems: number;
} | {
    additionalItems?: JsonSchema7Type;
});
export declare function parseTupleDef(def: ZodTupleDef<ZodTupleItems | [], ZodTypeAny | null>, refs: Refs): JsonSchema7TupleType;
