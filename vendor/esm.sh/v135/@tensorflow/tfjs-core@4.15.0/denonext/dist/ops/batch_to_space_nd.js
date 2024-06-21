/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/batch_to_space_nd) denonext production */
import{ENGINE as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{BatchToSpaceND as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as n from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function g(s,t,o){let e=p(s,"x","batchToSpaceND"),r=t.reduce((h,u)=>h*u);n.assert(e.rank>=1+t.length,()=>`input rank is ${e.rank} but should be > than blockShape.length ${t.length}`),n.assert(o.length===t.length,()=>`crops.length is ${o.length} but should be equal to blockShape.length  ${t.length}`),n.assert(e.shape[0]%r===0,()=>`input tensor batch is ${e.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${r}`);let i={x:e},a={blockShape:t,crops:o};return l.runKernel(c,i,a)}var N=m({batchToSpaceND_:g});export{N as batchToSpaceND};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/batch_to_space_nd.js:
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
//# sourceMappingURL=batch_to_space_nd.js.map