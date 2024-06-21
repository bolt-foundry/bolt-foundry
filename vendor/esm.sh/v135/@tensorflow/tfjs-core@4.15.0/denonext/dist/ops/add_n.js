/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/add_n) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{AddN as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function i(s){r.assert(Array.isArray(s),()=>"The argument passed to tf.addN() must be a list of tensors"),r.assert(s.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${s.length}`);let o=s.map((t,d)=>m(t,`tensors${d}`,"addN")),e=o[0];o.forEach(t=>{if(t.dtype!==e.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),o.forEach(t=>{if(!r.arraysEqual(t.shape,e.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});let a=o;return n.runKernel(p,a)}var c=f({addN_:i});export{c as addN};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/add_n.js:
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
//# sourceMappingURL=add_n.js.map