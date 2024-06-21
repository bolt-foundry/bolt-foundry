/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Range) denonext production */
import{Range as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{rangeImplCPU as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";var g=t=>{let{backend:r,attrs:o}=t,{start:a,stop:s,step:c,dtype:e}=o,n=p(a,s,c,e);return r.makeTensorInfo([n.length],e,n)},f={kernelName:m,backendName:"webgl",kernelFunc:g};export{g as range,f as rangeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Range.js:
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
//# sourceMappingURL=Range.js.map