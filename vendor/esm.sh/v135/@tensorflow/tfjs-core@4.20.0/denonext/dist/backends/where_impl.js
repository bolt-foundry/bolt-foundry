/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/backends/where_impl) denonext production */
import{buffer as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/buffer.js";function c(n,o){let e=[];for(let t=0;t<o.length;t++)o[t]&&e.push(t);let r=i(n,"int32"),f=i([e.length,n.length],"int32");for(let t=0;t<e.length;t++){let s=r.indexToLoc(e[t]),l=t*n.length;f.values.set(s,l)}return f.toTensor()}export{c as whereImpl};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/backends/where_impl.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=where_impl.js.map