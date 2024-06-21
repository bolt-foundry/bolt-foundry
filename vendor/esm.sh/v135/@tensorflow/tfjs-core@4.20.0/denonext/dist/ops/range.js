/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/range) denonext production */
import{ENGINE as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Range as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";function p(o,n,r=1,t="float32"){if(r===0)throw new Error("Cannot have a step of zero");let e={start:o,stop:n,step:r,dtype:t};return a.runKernel(f,{},e)}export{p as range};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/range.js:
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
//# sourceMappingURL=range.js.map