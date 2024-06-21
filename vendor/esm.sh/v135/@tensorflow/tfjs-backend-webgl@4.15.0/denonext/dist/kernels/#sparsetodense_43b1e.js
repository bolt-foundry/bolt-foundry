/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/SparseToDense) denonext production */
import{backend_util as y,SparseToDense as T,util as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{scatterImplCPU as x}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{ScatterProgram as B}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/scatter_gpu.js";import{reshape as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function V(f){let{inputs:l,backend:e,attrs:m}=f,{sparseIndices:t,sparseValues:s,defaultValue:r}=l,{outputShape:n}=m,{sliceRank:a,numUpdates:o,sliceSize:S,strides:c,outputSize:p}=y.calculateShapes(s,t,n),u=!1;if(s.dtype==="string"){let b=e.bufferSync(t),k=e.bufferSync(s),I=D.decodeString(e.readSync(r.dataId)[0]),d=x(b,k,n,p,S,o,a,c,I,u);return e.makeTensorInfo(n,d.dtype,d.values)}let g=new B(o,a,t.shape.length,s.shape.length,c,[p,1],u),i=e.runWebGLProgram(g,[s,t,r],s.dtype),h=P({inputs:{x:i},backend:e,attrs:{shape:n}});return e.disposeIntermediateTensorInfo(i),h}var U={kernelName:T,backendName:"webgl",kernelFunc:V};export{V as sparseToDense,U as sparseToDenseConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseToDense.js:
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
//# sourceMappingURL=SparseToDense.js.map