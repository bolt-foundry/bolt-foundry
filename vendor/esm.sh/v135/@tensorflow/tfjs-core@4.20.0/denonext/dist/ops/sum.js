/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/sum) denonext production */
import{ENGINE as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Sum as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{cast as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function c(t,r=null,m=!1){let o=p(t,"x","sum");o.dtype==="bool"&&(o=u(o,"int32"));let n={x:o},s={axis:r,keepDims:m};return e.runKernel(i,n,s)}var T=f({sum_:c});export{T as sum};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/sum.js:
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
//# sourceMappingURL=sum.js.map