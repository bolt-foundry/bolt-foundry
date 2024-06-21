/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Mean) denonext production */
import{backend_util as a,Mean as w,util as C}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{meanImpl as O}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Mean_impl.js";import{transposeImpl as v,transposeImplCPU as y}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose_impl.js";var N={kernelName:w,backendName:"webgl",kernelFunc:({inputs:x,attrs:h,backend:I})=>{let{x:e}=x,{keepDims:f,axis:g}=h,t=I,o=e.shape.length,u=C.parseAxisParam(g,e.shape),s=u,p=a.getAxesPermutation(s,o),A=p!=null,k=t.shouldExecuteOnCPU([e]),c=[],n=e;if(A){if(k){let T=t.texData.get(n.dataId).values,r=new Array(o);for(let m=0;m<r.length;m++)r[m]=e.shape[p[m]];let P=y(T,e.shape,e.dtype,p,r);n=t.makeTensorInfo(r,e.dtype);let b=t.texData.get(n.dataId);b.values=P}else n=v(e,p,t);c.push(n),s=a.getInnerMostAxes(s.length,o)}a.assertAxesAreInnerMostDims("sum",s,o);let[l,D]=a.computeOutAndReduceShapes(n.shape,s),i=l;f&&(i=a.expandShapeToKeepDim(l,u));let S=O(n,D,i,t);for(let d of c)t.disposeIntermediateTensorInfo(d);return S}};export{N as meanConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Mean.js:
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
//# sourceMappingURL=Mean.js.map