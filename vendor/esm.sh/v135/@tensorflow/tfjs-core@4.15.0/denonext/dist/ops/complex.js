/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/complex) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Complex as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function c(t,a){let o=m(t,"real","complex"),e=m(a,"imag","complex");r.assertShapesMatch(o.shape,e.shape,`real and imag shapes, ${o.shape} and ${e.shape}, must match in call to tf.complex().`);let p={real:o,imag:e};return s.runKernel(l,p)}var x=n({complex_:c});export{x as complex};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/complex.js:
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
//# sourceMappingURL=complex.js.map