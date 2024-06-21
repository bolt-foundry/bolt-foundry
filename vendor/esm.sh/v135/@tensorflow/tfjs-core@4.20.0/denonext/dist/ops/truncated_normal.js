/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/truncated_normal) denonext production */
import{assertNonNegativeIntegerDimensions as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util_base.js";import{buffer as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/buffer.js";import{op as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{MPRandGauss as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/rand_util.js";function c(e,n=0,s=1,r,a){if(m(e),r!=null&&r==="bool")throw new Error("Unsupported data type $ { dtype }");let u=new f(n,s,r,!0,a),o=i(e,r);for(let t=0;t<o.values.length;t++)o.values[t]=u.nextValue();return o.toTensor()}var v=l({truncatedNormal_:c});export{v as truncatedNormal};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/truncated_normal.js:
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
//# sourceMappingURL=truncated_normal.js.map