/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/MaxPoolWithArgmax_impl) denonext production */
import{Pool2DProgram as a}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pool_gpu.js";function p(o,e,t,m){let r=new a(t,"max",!1),u=m.runWebGLProgram(r,[o],"float32");r=new a(t,"max",!0,!0,e);let l=m.runWebGLProgram(r,[o],"float32");return[u,l]}export{p as maxPoolWithArgmaxImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolWithArgmax_impl.js:
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
//# sourceMappingURL=MaxPoolWithArgmax_impl.js.map