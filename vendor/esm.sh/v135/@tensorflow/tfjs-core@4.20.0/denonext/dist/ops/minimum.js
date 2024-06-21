/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/minimum) denonext production */
import{ENGINE as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Minimum as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{makeTypesMatch as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assertAndGetBroadcastShape as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/broadcast_util.js";import{cast as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function c(i,n){let m=t(i,"a","minimum"),o=t(n,"b","minimum");[m,o]=s(m,o),m.dtype==="bool"&&(m=r(m,"int32"),o=r(o,"int32")),f(m.shape,o.shape);let e={a:m,b:o};return p.runKernel(a,e)}var G=u({minimum_:c});export{G as minimum};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/minimum.js:
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
//# sourceMappingURL=minimum.js.map