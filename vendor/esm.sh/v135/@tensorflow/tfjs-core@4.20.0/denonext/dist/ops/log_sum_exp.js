/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/log_sum_exp) denonext production */
import{convertToTensor as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{parseAxisParam as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{add as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{expandShapeToKeepDim as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/axis_util.js";import{exp as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/exp.js";import{log as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/log.js";import{max as E}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/max.js";import{op as T}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";import{sub as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{sum as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sum.js";function w(s,n=null,a=!1){let o=u(s,"x","logSumExp"),r=l(n,o.shape),t=E(o,r,!0),i=b(o,t),f=d(i),c=v(f,r),p=g(c),m=h(e(t,p.shape),p);if(a){let x=S(m.shape,r);return e(m,x)}return m}var z=T({logSumExp_:w});export{z as logSumExp};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/log_sum_exp.js:
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
//# sourceMappingURL=log_sum_exp.js.map