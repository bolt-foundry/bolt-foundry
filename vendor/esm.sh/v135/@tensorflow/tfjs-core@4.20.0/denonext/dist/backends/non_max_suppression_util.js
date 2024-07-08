/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/backends/non_max_suppression_util) denonext production */
function a(t,e,i){let n=u(t,e,i),o=n<0?-(n+1):n;t.splice(o,0,e)}function u(t,e,i){return s(t,e,i||f)}function f(t,e){return t>e?1:t<e?-1:0}function s(t,e,i){let n=0,o=t.length,r=0,l=!1;for(;n<o;){r=n+(o-n>>>1);let c=i(e,t[r]);c>0?n=r+1:(o=r,l=!c)}return l?n:-n-1}export{a as binaryInsert,u as binarySearch};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/non_max_suppression_util.js:
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
//# sourceMappingURL=non_max_suppression_util.js.map