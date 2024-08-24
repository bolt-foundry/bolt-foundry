import { ZodIntersectionDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
export type JsonSchema7AllOfType = {
    allOf: JsonSchema7Type[];
    unevaluatedProperties?: boolean;
};
export declare function parseIntersectionDef(def: ZodIntersectionDef, refs: Refs): JsonSchema7AllOfType | JsonSchema7Type | undefined;
