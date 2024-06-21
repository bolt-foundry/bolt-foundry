/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Any) denonext production */
import{Any as y,backend_util as s,util as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reduce as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/reduce.js";import{reshape as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{transpose as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function T(h){let{inputs:l,backend:e,attrs:f}=h,{x:n}=l,{axis:A,keepDims:I}=f,o=n.shape.length,u=x.parseAxisParam(A,n.shape),t=u,a=s.getAxesPermutation(t,o),r=n;a!=null&&(r=D({inputs:{x:n},backend:e,attrs:{perm:a}}),t=s.getInnerMostAxes(t.length,o)),s.assertAxesAreInnerMostDims("any",t,o);let[d,g]=s.computeOutAndReduceShapes(r.shape,t),k=x.sizeFromShape(g),p=c({inputs:{x:r},backend:e,attrs:{shape:[-1,k]}}),i=b(p,p.dtype,"any",e),m;if(I){let S=s.expandShapeToKeepDim(d,u);m=c({inputs:{x:i},backend:e,attrs:{shape:S}})}else m=c({inputs:{x:i},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(i),a!=null&&e.disposeIntermediateTensorInfo(r),m}var N={kernelName:y,backendName:"webgl",kernelFunc:T};export{T as any,N as anyConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Any.js:
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
//# sourceMappingURL=Any.js.map