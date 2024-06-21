/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/zeros) denonext production */
import{ENGINE as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{assertNonNegativeIntegerDimensions as a,makeZerosTypedArray as f,sizeFromShape as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{complex as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/complex.js";function e(o,r="float32"){if(a(o),r==="complex64"){let m=e(o,"float32"),n=e(o,"float32");return l(m,n)}let t=f(s(o),r);return i.makeTensor(t,o,r)}export{e as zeros};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/zeros.js:
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
//# sourceMappingURL=zeros.js.map