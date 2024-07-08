/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/tile) denonext production */
import{ENGINE as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Tile as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function u(n,t){let r=l(n,"x","tile","string_or_numeric");o.assert(r.rank===t.length,()=>`Error in transpose: rank of input ${r.rank} must match length of reps ${t}.`);let i={x:r},e={reps:t};return m.runKernel(s,i,e)}var g=p({tile_:u});export{g as tile};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/tile.js:
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
//# sourceMappingURL=tile.js.map