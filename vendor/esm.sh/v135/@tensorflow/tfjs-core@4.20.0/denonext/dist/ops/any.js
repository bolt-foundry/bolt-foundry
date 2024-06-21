/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/any) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Any as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function f(o,n=null,r=!1){let t={x:p(o,"x","any","bool")},m={axis:n,keepDims:r};return s.runKernel(e,t,m)}var y=c({any_:f});export{y as any};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/any.js:
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
//# sourceMappingURL=any.js.map