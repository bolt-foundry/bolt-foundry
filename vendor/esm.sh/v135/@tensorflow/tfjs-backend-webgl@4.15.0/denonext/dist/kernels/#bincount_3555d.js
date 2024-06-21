/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Bincount) denonext production */
import{Bincount as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{bincountImplCPU as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function m(o){let{inputs:c,backend:t,attrs:s}=o,{x:a,weights:n}=c,{size:e}=s,r=t.readSync(a.dataId),i=t.readSync(n.dataId),d=u(r,i,n.dtype,n.shape,e);return t.makeTensorInfo([e],n.dtype,d)}var f={kernelName:p,backendName:"webgl",kernelFunc:m};export{m as bincount,f as bincountConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Bincount.js:
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
//# sourceMappingURL=Bincount.js.map