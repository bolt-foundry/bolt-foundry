import type * as Types from "./types.d.ts";
export { URLPattern } from "./types.d.ts";

declare global {
  class URLPattern extends Types.URLPattern {}
  type URLPatternInit = Types.URLPatternInit;
  type URLPatternResult = Types.URLPatternResult;
  type URLPatternComponentResult = Types.URLPatternComponentResult;
}
