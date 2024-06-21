/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ScatterNd) denonext production */
import{backend_util as T,env as b,ScatterNd as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ScatterProgram as N}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/scatter_gpu.js";import{ScatterPackedProgram as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/scatter_packed_gpu.js";import{reshape as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function w(g){let{inputs:I,backend:e,attrs:k}=g,{indices:r,updates:d}=I,{shape:a}=k,{sliceRank:o,numUpdates:n,sliceSize:p,strides:l,outputSize:m}=T.calculateShapes(d,r,a),f=[m/p,p];if(m===0)return e.makeTensorInfo(a,r.dtype);let s=c({inputs:{x:r},backend:e,attrs:{shape:[n,o]}}),t=c({inputs:{x:d},backend:e,attrs:{shape:[n,p]}}),u=e.makeTensorInfo([],"float32",new Float32Array([0])),i;b().getBool("WEBGL_PACK")?i=new P(n,o,s.shape.length,t.shape.length,l,f):i=new N(n,o,s.shape.length,t.shape.length,l,f);let h=e.runWebGLProgram(i,[t,s,u],t.dtype),S=c({inputs:{x:h},backend:e,attrs:{shape:a}});return e.disposeIntermediateTensorInfo(s),e.disposeIntermediateTensorInfo(t),e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(u),S}var C={kernelName:x,backendName:"webgl",kernelFunc:w};export{w as scatterNd,C as scatterNdConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ScatterNd.js:
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
//# sourceMappingURL=ScatterNd.js.map