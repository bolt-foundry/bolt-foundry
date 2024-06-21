/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Imag) denonext production */
import{Imag as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{identity as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";function r(n){let{inputs:e,backend:t}=n,{input:o}=e,a=t.texData.get(o.dataId);return m({inputs:{x:a.complexTensorInfos.imag},backend:t})}var s={kernelName:i,backendName:"webgl",kernelFunc:r};export{r as imag,s as imagConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Imag.js:
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
//# sourceMappingURL=Imag.js.map