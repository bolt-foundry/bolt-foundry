import { ZodLiteralDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { Refs } from "../Refs.d.ts";
export type JsonSchema7LiteralType = {
    type: "string" | "number" | "integer" | "boolean";
    const: string | number | boolean;
} | {
    type: "object" | "array";
};
export declare function parseLiteralDef(def: ZodLiteralDef, refs: Refs): JsonSchema7LiteralType;
