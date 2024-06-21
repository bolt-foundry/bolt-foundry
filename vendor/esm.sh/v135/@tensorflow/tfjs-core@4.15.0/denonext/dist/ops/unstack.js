/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/unstack) denonext production */
import{ENGINE as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Unpack as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function u(r,n=0){let t=i(r,"x","unstack","string_or_numeric");o.assert(n>=-t.shape.length&&n<t.shape.length,()=>`Axis = ${n} is not in [-${t.shape.length}, ${t.shape.length})`);let e={value:t},s={axis:n};return p.runKernel(c,e,s)}var g=m({unstack_:u});export{g as unstack};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/unstack.js:
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
//# sourceMappingURL=unstack.js.map