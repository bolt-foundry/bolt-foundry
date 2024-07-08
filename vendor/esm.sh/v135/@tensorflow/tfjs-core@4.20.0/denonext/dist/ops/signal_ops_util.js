/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/signal_ops_util) denonext production */
import{tensor1d as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor1d.js";function f(o){return Math.floor(Math.pow(2,Math.ceil(Math.log(o)/Math.log(2))))}function M(o,e,a){let n=1-o%2,r=new Float32Array(o);for(let t=0;t<o;++t){let c=2*Math.PI*t/(o+n-1);r[t]=e-a*Math.cos(c)}return l(r,"float32")}export{M as cosineWindow,f as enclosingPowerOfTwo};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/signal_ops_util.js:
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
//# sourceMappingURL=signal_ops_util.js.map