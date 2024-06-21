/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/PadV2) denonext production */
import{env as i,PadV2 as l,util as P}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{PadProgram as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pad_gpu.js";import{PadPackedProgram as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pad_packed_gpu.js";import{fill as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Fill.js";var k=n=>{let{inputs:p,backend:o,attrs:s}=n,{x:e}=p,{paddings:a,constantValue:t}=s;if(P.sizeFromShape(e.shape)===0){let d=a.map((r,u)=>r[0]+e.shape[u]+r[1]);return h({backend:o,attrs:{shape:d,value:t,dtype:e.dtype}})}let m=i().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new f(e.shape,a,t):new g(e.shape,a,t),c=[[t]];return o.runWebGLProgram(m,[e],e.dtype,c)},x={kernelName:l,backendName:"webgl",kernelFunc:k};export{k as padV2,x as padV2Config};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/PadV2.js:
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
//# sourceMappingURL=PadV2.js.map