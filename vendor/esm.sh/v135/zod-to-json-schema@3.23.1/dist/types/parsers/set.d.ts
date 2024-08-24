import { ZodSetDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { ErrorMessages } from "../errorMessages.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
export type JsonSchema7SetType = {
    type: "array";
    uniqueItems: true;
    items?: JsonSchema7Type;
    minItems?: number;
    maxItems?: number;
    errorMessage?: ErrorMessages<JsonSchema7SetType>;
};
export declare function parseSetDef(def: ZodSetDef, refs: Refs): JsonSchema7SetType;
