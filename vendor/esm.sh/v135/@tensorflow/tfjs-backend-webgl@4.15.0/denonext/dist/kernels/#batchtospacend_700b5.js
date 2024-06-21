/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/BatchToSpaceND) denonext production */
import{backend_util as s,BatchToSpaceND as D,util as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reshape as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{slice as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Slice.js";import{transpose as z}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";var B=u=>{let{inputs:g,backend:t,attrs:b}=u,{x:n}=g,{blockShape:e,crops:a}=b;I.assert(n.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");let p=e.reduce((r,N)=>r*N),c=s.getReshaped(n.shape,e,p),S=s.getPermuted(c.length,e.length),i=s.getReshapedPermuted(n.shape,e,p),f=s.getSliceBeginCoords(a,e.length),k=s.getSliceSize(i,a,e.length),o=[],h=l({inputs:{x:n},backend:t,attrs:{shape:c}}),d=z({inputs:{x:h},backend:t,attrs:{perm:S}}),m=l({inputs:{x:d},backend:t,attrs:{shape:i}}),x=T({inputs:{x:m},backend:t,attrs:{begin:f,size:k}});return o.push(h),o.push(d),o.push(m),o.forEach(r=>t.disposeIntermediateTensorInfo(r)),x},y={kernelName:D,backendName:"webgl",kernelFunc:B};export{B as batchToSpaceND,y as batchToSpaceNDConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchToSpaceND.js:
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
//# sourceMappingURL=BatchToSpaceND.js.map