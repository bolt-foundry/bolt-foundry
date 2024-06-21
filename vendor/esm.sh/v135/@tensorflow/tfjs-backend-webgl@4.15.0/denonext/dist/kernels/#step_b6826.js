/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Step) denonext production */
import{Step as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{CHECK_NAN_SNIPPET as m,UnaryOpProgram as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_gpu.js";function s({inputs:r,attrs:n,backend:o}){let{x:e}=r,t=m+`
    return x > 0.0 ? 1.0 : float(${n.alpha});
  `,p=new c(e.shape,t);return o.runWebGLProgram(p,[e],e.dtype)}var i={kernelName:a,backendName:"webgl",kernelFunc:s};export{s as step,i as stepConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Step.js:
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
//# sourceMappingURL=Step.js.map