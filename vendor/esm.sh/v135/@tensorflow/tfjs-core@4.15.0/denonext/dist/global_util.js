/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/global_util) denonext production */
import __Process$ from "node:process";
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
var n;function f(){if(n==null){let e;if(typeof window<"u")e=window;else if(typeof __global$<"u")e=__global$;else if(typeof __Process$<"u")e=__Process$;else if(typeof self<"u")e=self;else throw new Error("Could not find a global object");n=e}return n}function s(){let e=f();return e._tfGlobals==null&&(e._tfGlobals=new Map),e._tfGlobals}function a(e,o){let l=s();if(l.has(e))return l.get(e);{let t=o();return l.set(e,t),l.get(e)}}export{a as getGlobal,f as getGlobalNamespace};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/global_util.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=global_util.js.map