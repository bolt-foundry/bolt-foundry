/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/nonmax_util) denonext production */
import*as t from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";function p(s,u,e,n,i,a){n==null&&(n=.5),i==null&&(i=Number.NEGATIVE_INFINITY),a==null&&(a=0);let b=s.shape[0];return e=Math.min(e,b),t.assert(0<=n&&n<=1,()=>`iouThreshold must be in [0, 1], but was '${n}'`),t.assert(s.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${s.rank}'`),t.assert(s.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${s.shape[1]}`),t.assert(u.rank===1,()=>"scores must be a 1D tensor"),t.assert(u.shape[0]===b,()=>`scores has incompatible shape with boxes. Expected ${b}, but was ${u.shape[0]}`),t.assert(0<=a&&a<=1,()=>`softNmsSigma must be in [0, 1], but was '${a}'`),{maxOutputSize:e,iouThreshold:n,scoreThreshold:i,softNmsSigma:a}}export{p as nonMaxSuppSanityCheck};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/nonmax_util.js:
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
//# sourceMappingURL=nonmax_util.js.map