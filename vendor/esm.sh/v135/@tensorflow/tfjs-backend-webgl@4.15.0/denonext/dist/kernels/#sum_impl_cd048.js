/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Sum_impl) denonext production */
import{backend_util as o,sumOutType as y,util as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reduce as O}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/reduce.js";import{reshape as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{transposeImpl as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose_impl.js";function _(s,l,S,e){let x=l,p=s.shape.length,i=r.parseAxisParam(x,s.shape),t=i,u=o.getAxesPermutation(t,p),m=u!=null,n=s;m&&(n=D(s,u,e),t=o.getInnerMostAxes(t.length,p)),o.assertAxesAreInnerMostDims("sum",t,p);let[a,A]=o.computeOutAndReduceShapes(n.shape,t),h=a;S&&(h=o.expandShapeToKeepDim(a,i));let c=r.sizeFromShape(A),T=r.sizeFromShape(s.shape)/c,I=f({inputs:{x:n},attrs:{shape:[T,c]},backend:e}),z=y(s.dtype),d=O(I,z,"sum",e),g=f({inputs:{x:d},attrs:{shape:h},backend:e});return e.disposeIntermediateTensorInfo(I),e.disposeIntermediateTensorInfo(d),m&&e.disposeIntermediateTensorInfo(n),g}export{_ as sumImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Sum_impl.js:
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
//# sourceMappingURL=Sum_impl.js.map