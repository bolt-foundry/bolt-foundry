/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/dropout_util) denonext production */
import*as e from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";function n(t,l){if(l==null)return t.shape.slice();if(e.arraysEqual(t.shape,l))return l;if(t.shape.length===l.length){let u=[];for(let r=0;r<t.shape.length;r++)l[r]==null&&t.shape[r]!=null?u.push(t.shape[r]):u.push(l[r]);return u}return l}export{n as getNoiseShape};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/dropout_util.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=dropout_util.js.map