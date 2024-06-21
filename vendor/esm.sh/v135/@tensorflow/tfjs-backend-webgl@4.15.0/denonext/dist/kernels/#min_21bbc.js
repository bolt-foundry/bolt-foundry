/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Min) denonext production */
import{backend_util as n,Min as b,util as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reduce as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/reduce.js";import{reshape as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{transpose as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function M(l){let{inputs:x,backend:e,attrs:f}=l,{x:t}=x,{axis:g,keepDims:A}=f,c=t.shape.length,u=h.parseAxisParam(g,t.shape),s=u,o=n.getAxesPermutation(s,c),r=t;o!=null&&(r=T({inputs:{x:t},backend:e,attrs:{perm:o}}),s=n.getInnerMostAxes(s.length,t.shape.length)),n.assertAxesAreInnerMostDims("min",s,c);let[d,I]=n.computeOutAndReduceShapes(r.shape,s),k=h.sizeFromShape(I),a=m({inputs:{x:r},backend:e,attrs:{shape:[-1,k]}}),p=D(a,a.dtype,"min",e),i;if(A){let S=n.expandShapeToKeepDim(d,u);i=m({inputs:{x:p},backend:e,attrs:{shape:S}})}else i=m({inputs:{x:p},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(a),e.disposeIntermediateTensorInfo(p),o!=null&&e.disposeIntermediateTensorInfo(r),i}var P={kernelName:b,backendName:"webgl",kernelFunc:M};export{M as min,P as minConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Min.js:
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
//# sourceMappingURL=Min.js.map