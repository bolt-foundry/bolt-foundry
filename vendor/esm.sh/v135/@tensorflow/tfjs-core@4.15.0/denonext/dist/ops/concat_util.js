/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/concat_util) denonext production */
import*as s from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";function u(e,o){let t=e[0].length;e.forEach((a,c)=>{s.assert(a.length===t,()=>`Error in concat${t}D: rank of tensors[${c}] must be the same as the rank of the rest (${t})`)}),s.assert(o>=0&&o<t,()=>`Error in concat${t}D: axis must be between 0 and ${t-1}.`);let r=e[0];e.forEach((a,c)=>{for(let n=0;n<t;n++)s.assert(n===o||a[n]===r[n],()=>`Error in concat${t}D: Shape of tensors[${c}] (${a}) does not match the shape of the rest (${r}) along the non-concatenated axis ${c}.`)})}function f(e,o){let t=e[0].slice();for(let r=1;r<e.length;r++)t[o]+=e[r][o];return t}export{u as assertParamsConsistent,f as computeOutShape};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/concat_util.js:
  (**
   * @license
   * Copyright 2017 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=concat_util.js.map