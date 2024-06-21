/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/BroadcastArgs) denonext production */
import{backend_util as d,BroadcastArgs as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";function b(n){let{inputs:t,backend:a}=n,{s0:s,s1:e}=t,o=a.readSync(s.dataId),c=a.readSync(e.dataId),r=d.assertAndGetBroadcastShape(Array.from(o),Array.from(c));return a.makeTensorInfo([r.length],"int32",Int32Array.from(r))}var l={kernelName:m,backendName:"webgl",kernelFunc:b};export{b as broadcastArgs,l as broadcastArgsConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/BroadcastArgs.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=BroadcastArgs.js.map