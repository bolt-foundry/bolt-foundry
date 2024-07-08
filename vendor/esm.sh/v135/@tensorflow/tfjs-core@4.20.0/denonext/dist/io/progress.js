/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/io/progress) denonext production */
import{assert as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";function h(l,g,n,u){s(l),n=n??0,u=u??1,b(n,u);let t=0,m=e=>(e.then(r=>{let f=n+ ++t/l.length*(u-n);return g(f),r}),e);function s(e){o(e!=null&&Array.isArray(e)&&e.length>0,()=>"promises must be a none empty array")}function b(e,r){o(e>=0&&e<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${e}`),o(r>=0&&r<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${r}`),o(r>=e,()=>`startFraction must be no more than endFraction, but got startFraction ${e} and endFraction ${r}`)}return Promise.all(l.map(m))}export{h as monitorPromisesProgress};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/io/progress.js:
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
//# sourceMappingURL=progress.js.map