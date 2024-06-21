/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/abs) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Abs as e,ComplexAbs as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function i(t){let o=p(t,"x","abs");if(o.dtype==="complex64"){let r={x:o};return n.runKernel(s,r)}else{let r={x:o};return n.runKernel(e,r)}}var b=m({abs_:i});export{b as abs};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/abs.js:
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
//# sourceMappingURL=abs.js.map