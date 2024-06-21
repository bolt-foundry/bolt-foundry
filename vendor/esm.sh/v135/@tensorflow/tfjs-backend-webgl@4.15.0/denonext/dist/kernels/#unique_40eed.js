/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Unique) denonext production */
import{Unique as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{uniqueImplCPU as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{assertNotComplex as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl_util.js";function l(t){let{inputs:a,attrs:r,backend:n}=t,{axis:s}=r,{x:e}=a;d(e,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");let i=n.readSync(e.dataId),{outputValues:u,outputShape:p,indices:o}=m(i,s,e.shape,e.dtype);return[n.makeTensorInfo(p,e.dtype,u),n.makeTensorInfo([o.length],"int32",o)]}var b={kernelName:c,backendName:"webgl",kernelFunc:l};export{l as unique,b as uniqueConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Unique.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=Unique.js.map