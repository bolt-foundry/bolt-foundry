/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/ragged_range) denonext production */
import{ENGINE as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{RaggedRange as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function p(s,n,o){let t=e(s,"starts","raggedRange"),a=e(n,"limits","raggedRange",t.dtype),g=e(o,"deltas","raggedRange",t.dtype),i={starts:t,limits:a,deltas:g},r=d.runKernel(m,i);return{rtNestedSplits:r[0],rtDenseValues:r[1]}}var N=l({raggedRange_:p});export{N as raggedRange};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/ragged_range.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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
//# sourceMappingURL=ragged_range.js.map