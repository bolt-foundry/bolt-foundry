/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Cos) denonext production */
import{Cos as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{CHECK_NAN_SNIPPET_PACKED as o}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/binaryop_packed_gpu.js";import{CHECK_NAN_SNIPPET_UNARY as n,unaryKernelFunc as r}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";var t=n+`
  return cos(x);
`,c=`
  vec4 result = cos(x);
  bvec4 isNaN = isnan(x);
  ${o}
  return result;
`,s=r({opSnippet:t,packedOpSnippet:c}),i={kernelName:e,backendName:"webgl",kernelFunc:s};export{s as cos,i as cosConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Cos.js:
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
//# sourceMappingURL=Cos.js.map