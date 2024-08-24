import { ZodTypeDef } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { Options, Targets } from "./Options.d.ts";
import { JsonSchema7Type } from "./parseDef.d.ts";
export type Refs = {
    seen: Map<ZodTypeDef, Seen>;
    currentPath: string[];
    propertyPath: string[] | undefined;
} & Options<Targets>;
export type Seen = {
    def: ZodTypeDef;
    path: string[];
    jsonSchema: JsonSchema7Type | undefined;
};
export declare const getRefs: (options?: string | Partial<Options<Targets>>) => Refs;
