/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/expand_dims) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{ExpandDims as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function a(n,r=0){let t=p(n,"x","expandDims","string_or_numeric");o.assert(r<=t.rank,()=>"Axis must be <= rank of the tensor");let i={input:t},m={dim:r};return s.runKernel(e,i,m)}var D=u({expandDims_:a});export{D as expandDims};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/expand_dims.js:
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
//# sourceMappingURL=expand_dims.js.map