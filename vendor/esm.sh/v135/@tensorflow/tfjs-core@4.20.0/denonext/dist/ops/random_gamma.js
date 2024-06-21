/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/random_gamma) denonext production */
import{assertNonNegativeIntegerDimensions as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util_base.js";import{buffer as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/buffer.js";import{op as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{RandGamma as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/rand_util.js";function c(a,t,r=1,o="float32",f){if(e(a),r==null&&(r=1),o==null&&(o="float32"),o!=="float32"&&o!=="int32")throw new Error(`Unsupported data type ${o}`);let i=new u(t,r,o,f),n=l(a,o);for(let m=0;m<n.values.length;m++)n.values[m]=i.nextValue();return n.toTensor()}var p=s({randomGamma_:c});export{p as randomGamma};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/random_gamma.js:
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
//# sourceMappingURL=random_gamma.js.map