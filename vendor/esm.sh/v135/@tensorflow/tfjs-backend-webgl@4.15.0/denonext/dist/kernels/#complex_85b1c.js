/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Complex) denonext production */
import{Complex as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{identity as t}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";function i(c){let{inputs:m,backend:e}=c,{real:o,imag:r}=m,n=e.makeTensorInfo(o.shape,"complex64"),a=e.texData.get(n.dataId),s=t({inputs:{x:o},backend:e}),p=t({inputs:{x:r},backend:e});return a.complexTensorInfos={real:s,imag:p},n}var g={kernelName:l,backendName:"webgl",kernelFunc:i};export{i as complex,g as complexConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Complex.js:
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
//# sourceMappingURL=Complex.js.map