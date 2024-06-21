/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Abs) denonext production */
import{Abs as m,env as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{simpleAbsImplCPU as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{UnaryOpProgram as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_gpu.js";import{UnaryOpPackedProgram as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_packed_gpu.js";var t="return abs(x);";function b(n){let{inputs:a,backend:r}=n,{x:e}=a;if(r.shouldExecuteOnCPU([e])&&e.dtype!=="complex64"){let s=r.texData.get(e.dataId),p=l(s.values);return r.makeTensorInfo(e.shape,e.dtype,p)}let o;return c().getBool("WEBGL_PACK_UNARY_OPERATIONS")?o=new i(e.shape,t):o=new u(e.shape,t),r.runWebGLProgram(o,[e],e.dtype)}var P={kernelName:m,backendName:"webgl",kernelFunc:b};export{b as abs,P as absConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Abs.js:
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
//# sourceMappingURL=Abs.js.map