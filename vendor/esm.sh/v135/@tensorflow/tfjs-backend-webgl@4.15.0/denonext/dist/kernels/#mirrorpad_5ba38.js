/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/MirrorPad) denonext production */
import{env as p,MirrorPad as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{MirrorPadProgram as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/mirror_pad_gpu.js";import{MirrorPadPackedProgram as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/mirror_pad_packed_gpu.js";var i=({inputs:n,backend:t,attrs:a})=>{let{x:r}=n,{paddings:o,mode:e}=a,m=p().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new c(r.shape,o,e):new P(r.shape,o,e);return t.runWebGLProgram(m,[r],r.dtype)},f={kernelName:d,backendName:"webgl",kernelFunc:i};export{f as mirrorPadConfig,i as mirrorPadKernelFunc};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/MirrorPad.js:
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
//# sourceMappingURL=MirrorPad.js.map