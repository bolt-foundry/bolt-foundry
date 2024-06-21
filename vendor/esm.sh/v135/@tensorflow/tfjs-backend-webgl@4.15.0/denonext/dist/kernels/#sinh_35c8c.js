/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Sinh) denonext production */
import{Sinh as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{unaryKernelFunc as n}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";var o=`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`,r=n({opSnippet:o}),i={kernelName:e,backendName:"webgl",kernelFunc:r};export{r as sinh,i as sinhConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Sinh.js:
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
//# sourceMappingURL=Sinh.js.map