/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/TensorScatterUpdate) denonext production */
import{backend_util as T,TensorScatterUpdate as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ScatterProgram as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/scatter_gpu.js";import{reshape as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function U(h){let{inputs:l,backend:e,attrs:I}=h,{tensor:t,indices:n,updates:c}=l,{}=I,{sliceRank:d,numUpdates:r,sliceSize:a,strides:S,outputSize:m}=T.calculateShapes(c,n,t.shape),u=[m/a,a];if(m===0)return e.makeTensorInfo(t.shape,n.dtype);let o=s({inputs:{x:n},backend:e,attrs:{shape:[r,d]}}),p=s({inputs:{x:c},backend:e,attrs:{shape:[r,a]}}),i=s({inputs:{x:t},backend:e,attrs:{shape:u}}),g=new b(r,d,o.shape.length,p.shape.length,S,u,!1,!0),f=e.runWebGLProgram(g,[p,o,i],i.dtype),k=s({inputs:{x:f},backend:e,attrs:{shape:t.shape}});return e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(f),k}var N={kernelName:x,backendName:"webgl",kernelFunc:U};export{U as tensorScatterUpdate,N as tensorScatterUpdateConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/TensorScatterUpdate.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=TensorScatterUpdate.js.map