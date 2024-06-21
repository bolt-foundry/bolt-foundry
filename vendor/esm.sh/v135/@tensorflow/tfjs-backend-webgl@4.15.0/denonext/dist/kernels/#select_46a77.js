/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Select) denonext production */
import{Select as a,upcastType as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{SelectProgram as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/select_gpu.js";function m(o){let{inputs:r,backend:c}=o,{condition:t,t:e,e:n}=r,p=new l(t.shape.length,e.shape,e.shape.length);return c.runWebGLProgram(p,[t,e,n],s(e.dtype,n.dtype))}var u={kernelName:a,backendName:"webgl",kernelFunc:m};export{m as select,u as selectConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Select.js:
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
//# sourceMappingURL=Select.js.map