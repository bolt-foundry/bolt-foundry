import { ZodSchema } from "https://esm.sh/v135/zod@3.23.8/index.d.ts";
import { Options, Targets } from "./Options.d.ts";
import { JsonSchema7Type } from "./parseDef.d.ts";
declare const zodToJsonSchema: <Target extends Targets = "jsonSchema7">(schema: ZodSchema<any>, options?: string | Partial<Options<Target>> | undefined) => (Target extends "jsonSchema7" ? JsonSchema7Type : object) & {
    $schema?: string | undefined;
    definitions?: {
        [key: string]: Target extends "jsonSchema7" ? JsonSchema7Type : Target extends "jsonSchema2019-09" ? JsonSchema7Type : object;
    } | undefined;
};
export { zodToJsonSchema };
