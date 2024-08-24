import { ZodNumberDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { ErrorMessages } from "../errorMessages.d.ts";
import { Refs } from "../Refs.d.ts";
export type JsonSchema7NumberType = {
    type: "number" | "integer";
    minimum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
    errorMessage?: ErrorMessages<JsonSchema7NumberType>;
};
export declare function parseNumberDef(def: ZodNumberDef, refs: Refs): JsonSchema7NumberType;
