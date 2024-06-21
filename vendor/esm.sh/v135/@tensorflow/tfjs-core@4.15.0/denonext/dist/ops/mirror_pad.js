/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/mirror_pad) denonext production */
import{ENGINE as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{MirrorPad as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as n from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function u(s,e,o){n.assert(o==="reflect"||o==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${o}.`);let t=c(s,"x","mirrorPad");if(t.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");n.assert(e.length===t.rank,()=>`Padding doesn't match input. Must be ${t.rank}. Got ${e.length}.`);let a=o==="reflect"?1:0;for(let r=0;r<t.rank;r++)n.assert(e[r].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),n.assert(e[r][0]>=0&&e[r][0]<=t.shape[r]-a&&e[r][1]>=0&&e[r][1]<=t.shape[r]-a,()=>`Padding in dimension ${r} cannot be greater than or equal to ${t.shape[r]-a} or less than 0 for input of shape ${t.shape}`);let i={paddings:e,mode:o},l={x:t};return m.runKernel(f,l,i)}var k=h({mirrorPad_:u});export{k as mirrorPad};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/mirror_pad.js:
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
//# sourceMappingURL=mirror_pad.js.map