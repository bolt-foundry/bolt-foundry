/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/RaggedRange) denonext production */
import{RaggedRange as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{raggedRangeImplCPU as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function k(d){let{inputs:o,backend:e}=d,{starts:t,limits:a,deltas:n}=o,c=e.readSync(t.dataId),g=e.readSync(a.dataId),l=e.readSync(n.dataId),[s,r]=f(c,t.shape,t.dtype,g,a.shape,l,n.shape),p=e.makeTensorInfo([s.length],"int32",s),i=e.makeTensorInfo([r.length],t.dtype,r);return[p,i]}var h={kernelName:m,backendName:"webgl",kernelFunc:k};export{k as raggedRange,h as raggedRangeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedRange.js:
  (**
   * @license
   * Copyright 2022 Google LLC.
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
//# sourceMappingURL=RaggedRange.js.map