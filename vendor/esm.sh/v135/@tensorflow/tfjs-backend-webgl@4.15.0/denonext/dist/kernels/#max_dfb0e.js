/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Max) denonext production */
import{Max as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{backend_util as o,util as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{maxImplCPU as C}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{maxImpl as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Max_impl.js";import{transposeImpl as O,transposeImplCPU as U}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose_impl.js";function w(g){let{inputs:k,backend:t,attrs:A}=g,{x:e}=k,{reductionIndices:T,keepDims:S}=A,p=e.shape.length,d=D.parseAxisParam(T,e.shape),n=d,r=o.getAxesPermutation(n,p),i=r!=null,I=t.shouldExecuteOnCPU([e]),a=e;if(i){if(I){let c=t.texData.get(a.dataId).values,s=new Array(p);for(let u=0;u<s.length;u++)s[u]=e.shape[r[u]];let l=U(c,e.shape,e.dtype,r,s);a=t.makeTensorInfo(s,e.dtype);let P=t.texData.get(a.dataId);P.values=l}else a=O(e,r,t);n=o.getInnerMostAxes(n.length,p)}o.assertAxesAreInnerMostDims("max",n,p);let[h,f]=o.computeOutAndReduceShapes(a.shape,n),m=h;S&&(m=o.expandShapeToKeepDim(h,d));let x;if(I){let c=t.texData.get(a.dataId).values,s=C(c,D.sizeFromShape(f),m,e.dtype);x=t.makeTensorInfo(m,e.dtype);let l=t.texData.get(x.dataId);l.values=s}else x=b(a,f,m,t);return i&&t.disposeIntermediateTensorInfo(a),x}var V={kernelName:y,backendName:"webgl",kernelFunc:w};export{w as max,V as maxConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Max.js:
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
//# sourceMappingURL=Max.js.map