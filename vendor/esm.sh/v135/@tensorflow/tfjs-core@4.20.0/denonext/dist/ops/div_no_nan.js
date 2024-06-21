/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/div_no_nan) denonext production */
import{makeTypesMatch as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{div as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/div.js";import{equal as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/equal.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{where as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/where.js";import{zerosLike as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/zeros_like.js";function l(m,n){let r=i(m,"a","div"),o=i(n,"b","div");[r,o]=s(r,o);let t=a(r,o),e=d(t),p=f(o,e);return v(p,e,t)}var z=c({divNoNan_:l});export{z as divNoNan};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/div_no_nan.js:
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
//# sourceMappingURL=div_no_nan.js.map