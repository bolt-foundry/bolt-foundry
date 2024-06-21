/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/broadcast_args) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{BroadcastArgs as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function p(s,n){let r=o(s,"s0","broadcastArgs","int32"),t=o(n,"s1","broadcastArgs","int32");if(r.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${r.rank}`);if(t.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${t.rank}`);let a={s0:r,s1:t};return c.runKernel(e,a)}var f=i({broadcastArgs_:p});export{f as broadcastArgs};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/broadcast_args.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=broadcast_args.js.map