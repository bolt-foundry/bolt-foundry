/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Fill) denonext production */
import{Fill as m,util as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{FillProgram as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/fill_gpu.js";function f(s){let{backend:l,attrs:a}=s,{shape:o,value:r}=a,{dtype:e}=a;if(e=e||t.inferDtype(r),e==="string"){let n=t.getArrayFromDType(e,t.sizeFromShape(o));return n.fill(r),l.makeTensorInfo(o,e,n)}else{let n=new c(o,r),i=[[r]];return l.runWebGLProgram(n,[],e,i)}}var g={kernelName:m,backendName:"webgl",kernelFunc:f};export{f as fill,g as fillConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Fill.js:
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
//# sourceMappingURL=Fill.js.map