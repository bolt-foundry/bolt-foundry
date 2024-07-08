/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/ragged_gather) denonext production */
import{ENGINE as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{RaggedGather as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function G(s,r,a,n){let o=s.map((c,u)=>t(c,`tensors${u}`,"raggedGather","int32")),i=t(r,"paramsDenseValues","raggedGather"),p=t(a,"indices","raggedGather","int32"),g={paramsNestedSplits:o,paramsDenseValues:i,indices:p},m={outputRaggedRank:n},e=d.runKernel(l,g,m);return{outputNestedSplits:e.slice(0,e.length-1),outputDenseValues:e[e.length-1]}}var $=h({raggedGather_:G});export{$ as raggedGather};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/ragged_gather.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=ragged_gather.js.map