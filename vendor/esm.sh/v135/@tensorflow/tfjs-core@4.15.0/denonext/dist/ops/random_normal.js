/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/random_normal) denonext production */
import{assertNonNegativeIntegerDimensions as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util_base.js";import{buffer as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/buffer.js";import{op as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{MPRandGauss as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/rand_util.js";function c(e,t=0,s=1,o,a){if(l(e),o!=null&&o==="bool")throw new Error(`Unsupported data type ${o}`);let m=new u(t,s,o,!1,a),r=f(e,o);for(let n=0;n<r.values.length;n++)r.values[n]=m.nextValue();return r.toTensor()}var w=i({randomNormal_:c});export{w as randomNormal};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/random_normal.js:
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
//# sourceMappingURL=random_normal.js.map