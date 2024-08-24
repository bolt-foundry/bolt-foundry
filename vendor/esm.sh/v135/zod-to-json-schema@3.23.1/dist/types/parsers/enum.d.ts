import { ZodEnumDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
export type JsonSchema7EnumType = {
    type: "string";
    enum: string[];
};
export declare function parseEnumDef(def: ZodEnumDef): JsonSchema7EnumType;
