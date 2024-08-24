import { ZodArrayDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { ErrorMessages } from "../errorMessages.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
export type JsonSchema7ArrayType = {
    type: "array";
    items?: JsonSchema7Type;
    minItems?: number;
    maxItems?: number;
    errorMessages?: ErrorMessages<JsonSchema7ArrayType, "items">;
};
export declare function parseArrayDef(def: ZodArrayDef, refs: Refs): JsonSchema7ArrayType;
