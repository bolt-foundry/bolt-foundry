/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Sum) denonext production */
import{Sum as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{sumImpl as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Sum_impl.js";function i(e){let{inputs:n,backend:t,attrs:m}=e,{x:o}=n,{axis:r,keepDims:s}=m;return u(o,r,s,t)}var k={kernelName:c,backendName:"webgl",kernelFunc:i};export{i as sum,k as sumConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Sum.js:
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
//# sourceMappingURL=Sum.js.map