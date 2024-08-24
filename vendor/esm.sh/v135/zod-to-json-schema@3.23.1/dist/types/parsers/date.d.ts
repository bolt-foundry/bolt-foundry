import { ZodDateDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { Refs } from "../Refs.d.ts";
import { ErrorMessages } from "../errorMessages.d.ts";
import { JsonSchema7NumberType } from "./number.d.ts";
import { DateStrategy } from "../Options.d.ts";
export type JsonSchema7DateType = {
    type: "integer" | "string";
    format: "unix-time" | "date-time" | "date";
    minimum?: number;
    maximum?: number;
    errorMessage?: ErrorMessages<JsonSchema7NumberType>;
} | {
    anyOf: JsonSchema7DateType[];
};
export declare function parseDateDef(def: ZodDateDef, refs: Refs, overrideDateStrategy?: DateStrategy): JsonSchema7DateType;
