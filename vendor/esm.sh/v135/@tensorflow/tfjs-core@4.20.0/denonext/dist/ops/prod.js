/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/prod) denonext production */
import{ENGINE as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Prod as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{cast as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function l(r,t=null,n=!1){let o=f(r,"x","prod");o.dtype==="bool"&&(o=s(o,"int32"));let p={x:o},m={axis:t,keepDims:n};return e.runKernel(i,p,m)}var N=c({prod_:l});export{N as prod};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/prod.js:
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
//# sourceMappingURL=prod.js.map