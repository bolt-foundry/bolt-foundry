/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Transpose) denonext production */
import{Transpose as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{transposeImpl as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose_impl.js";import{transposeImplCPU as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose_impl.js";function h(r){let{inputs:p,backend:c,attrs:l}=r,{x:e}=p,{perm:o}=l,t=c,u=e.shape.length,n=new Array(u);for(let a=0;a<n.length;a++)n[a]=e.shape[o[a]];let s;if(t.shouldExecuteOnCPU([e])){let m=t.texData.get(e.dataId).values,x=g(m,e.shape,e.dtype,o,n);s=t.makeTensorInfo(n,e.dtype);let d=t.texData.get(s.dataId);d.values=x}else s=i(e,o,t);return s}var T={kernelName:f,backendName:"webgl",kernelFunc:h};export{h as transpose,T as transposeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Transpose.js:
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
//# sourceMappingURL=Transpose.js.map