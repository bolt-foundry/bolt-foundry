import defaultErrorMap from "./locales/en.d.ts";
import type { ZodErrorMap } from "./ZodError.d.ts";
export { defaultErrorMap };
export declare function setErrorMap(map: ZodErrorMap): void;
export declare function getErrorMap(): ZodErrorMap;
