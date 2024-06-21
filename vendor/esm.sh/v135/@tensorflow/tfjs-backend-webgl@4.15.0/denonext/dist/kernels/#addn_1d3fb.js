/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/AddN) denonext production */
import{AddN as u,env as p,upcastType as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{AddNProgram as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/addn_gpu.js";import{AddNPackedProgram as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/addn_packed_gpu.js";import{identity as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";function r(d){let{inputs:a,backend:n}=d,e=a;if(e.length===1)return h({inputs:{x:e[0]},backend:n});if(e.length>p().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){let t=Math.floor(e.length/2),o=r({inputs:e.slice(0,t),backend:n}),m=r({inputs:e.slice(t),backend:n});return r({inputs:[o,m],backend:n})}let c=e.map(t=>t.dtype).reduce((t,o)=>g(t,o)),s=e.map(t=>t.shape),i=p().getBool("WEBGL_PACK")?new f(e[0].shape,s):new l(e[0].shape,s);return n.runWebGLProgram(i,e,c)}var E={kernelName:u,backendName:"webgl",kernelFunc:r};export{r as addN,E as addNConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/AddN.js:
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
//# sourceMappingURL=AddN.js.map