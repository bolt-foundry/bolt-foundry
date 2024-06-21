/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/max_pool_with_argmax) denonext production */
import{ENGINE as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{MaxPoolWithArgmax as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function p(r,t,m,n,x=!1){let s={x:l(r,"x","maxPoolWithArgmax")},e={filterSize:t,strides:m,pad:n,includeBatchInIndex:x},o=i.runKernel(a,s,e);return{result:o[0],indexes:o[1]}}var P=c({maxPoolWithArgmax_:p});export{P as maxPoolWithArgmax};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/max_pool_with_argmax.js:
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
//# sourceMappingURL=max_pool_with_argmax.js.map