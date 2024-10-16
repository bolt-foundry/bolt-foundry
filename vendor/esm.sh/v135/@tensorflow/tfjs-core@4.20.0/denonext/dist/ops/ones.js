/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/ones) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{makeOnesTypedArray as i,sizeFromShape as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{assertNonNegativeIntegerDimensions as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util_base.js";import{complex as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/complex.js";import{zeros as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/zeros.js";function c(o,r="float32"){if(s(o),r==="complex64"){let e=c(o,"float32"),t=l(o,"float32");return a(e,t)}let m=i(f(o),r);return n.makeTensor(m,o,r)}export{c as ones};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/ones.js:
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
//# sourceMappingURL=ones.js.map