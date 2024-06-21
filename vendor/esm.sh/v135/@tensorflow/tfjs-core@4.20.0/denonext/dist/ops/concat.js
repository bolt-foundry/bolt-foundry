/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/concat) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Concat as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensorArray as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assert as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{clone as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/clone.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function l(o,n=0){p(o.length>=1,()=>"Pass at least one tensor to concat");let t=m(o,"tensors","concat","string_or_numeric");if(t[0].dtype==="complex64"&&t.forEach(r=>{if(r.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${r.dtype}. `)}),t.length===1)return i(t[0]);let e=t,c={axis:n};return s.runKernel(a,e,c)}var E=f({concat_:l});export{E as concat};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/concat.js:
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
//# sourceMappingURL=concat.js.map