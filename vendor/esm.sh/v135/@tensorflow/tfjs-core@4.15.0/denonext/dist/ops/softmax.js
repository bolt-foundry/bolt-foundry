/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/softmax) denonext production */
import{ENGINE as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Softmax as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function e(r,o=-1){let t=i(r,"logits","softmax","float32");if(o===-1&&(o=t.rank-1),o!==t.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${t.rank} and dim was ${o}`);let n={logits:t},s={dim:o};return a.runKernel(f,n,s)}var g=m({softmax_:e});export{g as softmax};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/softmax.js:
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
//# sourceMappingURL=softmax.js.map