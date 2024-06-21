/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ZerosLike) denonext production */
import{ZerosLike as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{complex as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Complex.js";import{fill as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Fill.js";import{imag as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Imag.js";import{real as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Real.js";function n(p){let{inputs:m,backend:e}=p,{x:t}=m;if(t.dtype==="complex64"){let o=l({inputs:{input:t},backend:e}),r=n({inputs:{x:o},backend:e}),s=f({inputs:{input:t},backend:e}),i=n({inputs:{x:s},backend:e}),a=d({inputs:{real:r,imag:i},backend:e});return e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(r),e.disposeIntermediateTensorInfo(s),e.disposeIntermediateTensorInfo(i),a}else return u({attrs:{shape:t.shape,dtype:t.dtype,value:t.dtype==="string"?"":0},backend:e})}var T={kernelName:c,backendName:"webgl",kernelFunc:n};export{n as zerosLike,T as zerosLikeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ZerosLike.js:
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
//# sourceMappingURL=ZerosLike.js.map