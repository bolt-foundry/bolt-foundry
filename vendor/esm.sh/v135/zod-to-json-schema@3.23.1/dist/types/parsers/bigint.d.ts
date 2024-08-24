import { ZodBigIntDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { Refs } from "../Refs.d.ts";
import { ErrorMessages } from "../errorMessages.d.ts";
export type JsonSchema7BigintType = {
    type: "integer";
    format: "int64";
    minimum?: BigInt;
    exclusiveMinimum?: BigInt;
    maximum?: BigInt;
    exclusiveMaximum?: BigInt;
    multipleOf?: BigInt;
    errorMessage?: ErrorMessages<JsonSchema7BigintType>;
};
export declare function parseBigintDef(def: ZodBigIntDef, refs: Refs): JsonSchema7BigintType;
