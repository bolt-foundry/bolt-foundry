/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/erf) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Erf as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{cast as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function s(o){let t=n(o,"x","erf");r.assert(t.dtype==="int32"||t.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),t.dtype==="int32"&&(t=p(t,"float32"));let e={x:t};return f.runKernel(i,e)}var x=m({erf_:s});export{x as erf};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/erf.js:
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
//# sourceMappingURL=erf.js.map