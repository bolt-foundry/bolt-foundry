/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Log) denonext production */
import{Log as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{CHECK_NAN_SNIPPET_UNARY as e,unaryKernelFunc as t}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";import{logImplCPU as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";var o=e+`
  return x < 0.0 ? 0./0. : log(x);
`,s=`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,n=t({opSnippet:o,packedOpSnippet:s,cpuKernelImpl:l}),p={kernelName:r,backendName:"webgl",kernelFunc:n};export{n as log,p as logConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Log.js:
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
//# sourceMappingURL=Log.js.map