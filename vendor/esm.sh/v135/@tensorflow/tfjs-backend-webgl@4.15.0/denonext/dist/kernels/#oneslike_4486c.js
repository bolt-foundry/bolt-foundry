/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/OnesLike) denonext production */
import{OnesLike as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{complex as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Complex.js";import{fill as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Fill.js";import{imag as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Imag.js";import{real as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Real.js";import{zerosLike as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/ZerosLike.js";function i(p){let{inputs:m,backend:e}=p,{x:t}=m;if(t.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(t.dtype==="complex64"){let n=l({inputs:{input:t},backend:e}),o=i({inputs:{x:n},backend:e}),r=c({inputs:{input:t},backend:e}),s=k({inputs:{x:r},backend:e}),a=u({inputs:{real:o,imag:s},backend:e});return e.disposeIntermediateTensorInfo(n),e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(r),e.disposeIntermediateTensorInfo(s),a}else return f({attrs:{shape:t.shape,dtype:t.dtype,value:1},backend:e})}var b={kernelName:d,backendName:"webgl",kernelFunc:i};export{i as onesLike,b as onesLikeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/OnesLike.js:
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
//# sourceMappingURL=OnesLike.js.map