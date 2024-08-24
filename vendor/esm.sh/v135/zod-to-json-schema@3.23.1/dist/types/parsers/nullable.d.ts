import { ZodNullableDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { JsonSchema7Type } from "../parseDef.d.ts";
import { Refs } from "../Refs.d.ts";
import { JsonSchema7NullType } from "./null.d.ts";
export type JsonSchema7NullableType = {
    anyOf: [JsonSchema7Type, JsonSchema7NullType];
} | {
    type: [string, "null"];
};
export declare function parseNullableDef(def: ZodNullableDef, refs: Refs): JsonSchema7NullableType | undefined;
