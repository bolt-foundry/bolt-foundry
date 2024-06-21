/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ComplexAbs) denonext production */
import{ComplexAbs as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ComplexAbsProgram as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/complex_abs_gpu.js";function p(n,e){return{dataId:e.dataId,dtype:e.dtype,shape:n.shape}}function d(n){let{inputs:e,backend:t}=n,{x:o}=e,r=t.texData.get(o.dataId),s=new c(o.shape),a=[p(o,r.complexTensorInfos.real),p(o,r.complexTensorInfos.imag)];return t.runWebGLProgram(s,a,a[0].dtype)}var b={kernelName:m,backendName:"webgl",kernelFunc:d};export{d as complexAbs,b as complexAbsConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ComplexAbs.js:
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
//# sourceMappingURL=ComplexAbs.js.map