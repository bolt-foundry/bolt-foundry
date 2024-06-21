/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/multinomial) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Multinomial as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function b(m,l,r,e=!1){let o=p(m,"logits","multinomial"),n=o.size,t=o.rank;if(n<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${n}.`);if(t>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${t}`);r=r||Math.random();let a={logits:t===1?s(o,[1,-1]):o},u={numSamples:l,seed:r,normalized:e},i=c.runKernel(f,a,u);return t===1?s(i,[i.size]):i}var D=g({multinomial_:b});export{D as multinomial};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/multinomial.js:
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
//# sourceMappingURL=multinomial.js.map