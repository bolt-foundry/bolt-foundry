import { ZodNativeEnumDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
export type JsonSchema7NativeEnumType = {
    type: "string" | "number" | ["string", "number"];
    enum: (string | number)[];
};
export declare function parseNativeEnumDef(def: ZodNativeEnumDef): JsonSchema7NativeEnumType;
