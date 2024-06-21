/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/LinSpace) denonext production */
import{LinSpace as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{linSpaceImplCPU as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function m(e){let{backend:t,attrs:o}=e,{start:a,stop:r,num:c}=o,n=p(a,r,c);return t.makeTensorInfo([n.length],"float32",n)}var f={kernelName:l,backendName:"webgl",kernelFunc:m};export{m as linSpace,f as linSpaceConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/LinSpace.js:
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
//# sourceMappingURL=LinSpace.js.map