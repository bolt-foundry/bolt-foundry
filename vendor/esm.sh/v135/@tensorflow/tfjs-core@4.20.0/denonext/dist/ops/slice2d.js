/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/slice2d) denonext production */
import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{slice as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/slice.js";function a(t,e,s){let r=n(t,"x","slice2d");return o.assert(r.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`),c(r,e,s)}var f=i({slice2d_:a});export{f as slice2d};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/slice2d.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=slice2d.js.map