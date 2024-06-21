/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/logical_xor) denonext production */
import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertAndGetBroadcastShape as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/broadcast_util.js";import{logicalAnd as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/logical_and.js";import{logicalNot as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/logical_not.js";import{logicalOr as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/logical_or.js";import{op as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function e(o,r){let i=t(o,"a","logicalXor","bool"),a=t(r,"b","logicalXor","bool");return c(i.shape,a.shape),l(p(o,r),m(l(o,r)))}var b=n({logicalXor_:e});export{b as logicalXor};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/logical_xor.js:
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
//# sourceMappingURL=logical_xor.js.map