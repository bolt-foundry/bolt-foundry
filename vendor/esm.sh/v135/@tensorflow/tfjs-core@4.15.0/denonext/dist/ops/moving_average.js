/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/moving_average) denonext production */
import{assertTypesMatch as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{add as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/add.js";import{div as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/div.js";import{mul as A}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{op as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{pow as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/pow.js";import{scalar as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/scalar.js";import{sub as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sub.js";function T(p,v,u,s,c=!0){let r=e(p,"v","movingAverage"),t=e(v,"x","movingAverage"),a=e(u,"decay","movingAverage");l(r,t),o.assert(o.arraysEqual(r.shape,t.shape),()=>"Shape mismatch in v and x");let n=$(1),g=m(n,a),i=A(m(t,r),g);if(c){o.assert(s!=null,()=>"When using zeroDebias: true, step is required.");let f=e(s,"step","movingAverage");i=h(i,m(n,x(a,f)))}return d(r,i)}var _=y({movingAverage_:T});export{_ as movingAverage};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/moving_average.js:
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
//# sourceMappingURL=moving_average.js.map