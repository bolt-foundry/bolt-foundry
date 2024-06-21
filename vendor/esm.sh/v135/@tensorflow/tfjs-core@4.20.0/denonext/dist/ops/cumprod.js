/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/cumprod) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Cumprod as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function f(o,r=0,t=!1,m=!1){let n={x:e(o,"x","cumprod")},p={axis:r,exclusive:t,reverse:m};return c.runKernel(s,n,p)}var E=u({cumprod_:f});export{E as cumprod};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/cumprod.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the 'License');
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an 'AS IS' BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=cumprod.js.map