/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/dropout) denonext production */
import{Tensor as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor.js";import{convertToTensor as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{add as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/add.js";import{div as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/div.js";import{getNoiseShape as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/dropout_util.js";import{floor as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/floor.js";import{mul as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{op as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{randomUniform as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/random_uniform.js";function $(i,t,n,m){let o=a(i,"x","dropout");if(r.assert(o.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${o.dtype} tensor instead.`),r.assert(t>=0&&t<1,()=>`rate must be a float in the range [0, 1), but got ${t}.`),t===0)return i instanceof f?o.clone():o;let s=c(o,n),e=1-t,p=l(d(u(h(s,0,1,"float32",m),e)),e);return g(o,p)}var _=b({dropout_:$});export{_ as dropout};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/dropout.js:
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
//# sourceMappingURL=dropout.js.map