/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Sign) denonext production */
import{Sign as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{unaryKernelFunc as e}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";var r=`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`,o=e({opSnippet:r}),p={kernelName:n,backendName:"webgl",kernelFunc:o};export{o as sign,p as signConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Sign.js:
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
//# sourceMappingURL=Sign.js.map