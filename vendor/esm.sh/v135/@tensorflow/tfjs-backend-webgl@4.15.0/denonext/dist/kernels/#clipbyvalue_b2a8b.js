/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ClipByValue) denonext production */
import{ClipByValue as i,env as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ClipProgram as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/clip_gpu.js";import{ClipPackedProgram as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/clip_packed_gpu.js";function g(r){let{inputs:n,backend:a,attrs:l}=r,{x:e}=n,{clipValueMin:t,clipValueMax:p}=l,o;m().getBool("WEBGL_PACK_CLIP")?o=new u(e.shape):o=new s(e.shape);let c=[[t],[p]];return a.runWebGLProgram(o,[e],e.dtype,c)}var V={kernelName:i,backendName:"webgl",kernelFunc:g};export{g as clipByValue,V as clipByValueConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ClipByValue.js:
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
//# sourceMappingURL=ClipByValue.js.map