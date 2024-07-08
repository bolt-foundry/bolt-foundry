/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/ragged_tensor_to_tensor) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{RaggedTensorToTensor as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function $(r,n,s,t,T){let a=o(r,"shape","raggedTensorToTensor","int32"),e=o(n,"values","raggedTensorToTensor"),g=o(s,"defaultValue","raggedTensorToTensor",e.dtype),u=t.map((d,l)=>o(d,`tensors${l}`,"raggedTensorToTensor","int32")),i={shape:a,values:e,defaultValue:g,rowPartitionTensors:u},p={rowPartitionTypes:T};return c.runKernel(m,i,p)}var E=f({raggedTensorToTensor_:$});export{E as raggedTensorToTensor};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/ragged_tensor_to_tensor.js:
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
//# sourceMappingURL=ragged_tensor_to_tensor.js.map