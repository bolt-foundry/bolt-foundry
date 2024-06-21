/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/LogicalOr) denonext production */
import{LogicalOr as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{binaryKernelFunc as r}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";var n="return float(a >= 1.0 || b >= 1.0);",o=`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,a=r({opSnippet:n,packedOpSnippet:o,dtype:"bool"}),l={kernelName:e,backendName:"webgl",kernelFunc:a};export{a as logicalOr,l as logicalOrConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/LogicalOr.js:
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
//# sourceMappingURL=LogicalOr.js.map