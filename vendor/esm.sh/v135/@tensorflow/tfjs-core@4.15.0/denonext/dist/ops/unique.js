/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/unique) denonext production */
import{ENGINE as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Unique as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assert as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function f(t,n=0){let r=c(t,"x","unique","string_or_numeric");p(r.rank>0,()=>"The input tensor must be at least 1D");let o={x:r},e={axis:n},[i,s]=u.runKernel(m,o,e);return{values:i,indices:s}}var v=a({unique_:f});export{v as unique};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/unique.js:
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
//# sourceMappingURL=unique.js.map