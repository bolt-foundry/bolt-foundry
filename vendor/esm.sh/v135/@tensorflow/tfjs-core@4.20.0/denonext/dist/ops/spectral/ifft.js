/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/spectral/ifft) denonext production */
import{ENGINE as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{IFFT as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{assert as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function p(t){f(t.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${t.dtype}.`);let o={input:t};return r.runKernel(e,o)}var l=m({ifft_:p});export{l as ifft};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/spectral/ifft.js:
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
//# sourceMappingURL=ifft.js.map