/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Diag) denonext production */
import{Diag as u,util as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{DiagProgram as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/diag_gpu.js";import{reshape as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function f(a){let{inputs:p,backend:e}=a,{x:t}=p,i=[...t.shape,...t.shape],n=d.sizeFromShape(t.shape),o=s({inputs:{x:t},backend:e,attrs:{shape:[n]}}),m=new g(n),r=e.runWebGLProgram(m,[o],o.dtype),c=s({inputs:{x:r},backend:e,attrs:{shape:i}});return e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(r),c}var b={kernelName:u,backendName:"webgl",kernelFunc:f};export{f as diag,b as diagConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Diag.js:
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
//# sourceMappingURL=Diag.js.map