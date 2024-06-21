/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/GatherNd) denonext production */
import{backend_util as x,GatherNd as y,util as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{GatherNDProgram as z}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gather_nd_gpu.js";import{gatherNdImplCPU as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{reshape as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function T(l){let{inputs:f,backend:e}=l,{params:t,indices:s}=f,i=s.shape,a=i[i.length-1],g=u.sizeFromShape(t.shape),[c,r,n,d]=x.prepareAndValidate(t,s),m=p({inputs:{x:s},backend:e,attrs:{shape:[r,a]}}),o=p({inputs:{x:t},backend:e,attrs:{shape:[u.sizeFromShape(t.shape)/n,n]}});if(e.shouldExecuteOnCPU([t,s])||t.dtype==="string"){let k=e.readSync(s.dataId),N=e.bufferSync(t),b=P(k,N,t.dtype,r,a,n,d,t.shape,g);return e.makeTensorInfo(c,t.dtype,b.values)}let I=new z(a,d,[r,n],t.shape),h=e.runWebGLProgram(I,[o,m],o.dtype),S=p({inputs:{x:h},backend:e,attrs:{shape:c}});return e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(h),S}var D={kernelName:y,backendName:"webgl",kernelFunc:T};export{T as gatherNd,D as gatherNdConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/GatherNd.js:
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
//# sourceMappingURL=GatherNd.js.map