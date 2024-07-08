/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/pow) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Pow as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{makeTypesMatch as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function a(t,e){let o=p(t,"base","pow"),r=p(e,"exp","pow");[o,r]=s(o,r);let m={a:o,b:r};return n.runKernel(i,m)}var x=f({pow_:a});export{x as pow};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/pow.js:
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
//# sourceMappingURL=pow.js.map