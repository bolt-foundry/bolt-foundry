/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Log1p) denonext production */
import{Log1p as o}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{CHECK_NAN_SNIPPET_UNARY as e,unaryKernelFunc as n}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";var r=e+`
  return log(1.0 + x);
`,p=n({opSnippet:r}),c={kernelName:o,backendName:"webgl",kernelFunc:p};export{p as log1p,c as log1pConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Log1p.js:
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
//# sourceMappingURL=Log1p.js.map