/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/All) denonext production */
import{All as b,backend_util as s,util as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reduce as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/reduce.js";import{reshape as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{transpose as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function w(x){let{inputs:h,backend:e,attrs:f}=x,{x:n}=h,{axis:A,keepDims:I}=f,o=n.shape.length,c=d.parseAxisParam(A,n.shape),t=c,a=s.getAxesPermutation(t,o),r=n;a!=null&&(r=T({inputs:{x:n},backend:e,attrs:{perm:a}}),t=s.getInnerMostAxes(t.length,o)),s.assertAxesAreInnerMostDims("all",t,o);let[u,g]=s.computeOutAndReduceShapes(r.shape,t),k=d.sizeFromShape(g),p=m({inputs:{x:r},backend:e,attrs:{shape:[-1,k]}}),i=D(p,p.dtype,"all",e),l;if(I){let S=s.expandShapeToKeepDim(u,c);l=m({inputs:{x:i},backend:e,attrs:{shape:S}})}else l=m({inputs:{x:i},backend:e,attrs:{shape:u}});return e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(i),a!=null&&e.disposeIntermediateTensorInfo(r),l}var P={kernelName:b,backendName:"webgl",kernelFunc:w};export{w as all,P as allConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/All.js:
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
//# sourceMappingURL=All.js.map