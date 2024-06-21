/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Prod) denonext production */
import{backend_util as a,Prod as y,sumOutType as P,util as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reduce as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/reduce.js";import{prodImplCPU as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{reshape as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{transpose as C}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function O(g){let{inputs:k,backend:e,attrs:A}=g,{x:n}=k,{axis:D,keepDims:S}=A,i=n.shape.length,r=[],h=f.parseAxisParam(D,n.shape),p=h,x=a.getAxesPermutation(p,i),t=n;x!=null&&(t=C({inputs:{x:n},backend:e,attrs:{perm:x}}),p=a.getInnerMostAxes(p.length,i),r.push(t)),a.assertAxesAreInnerMostDims("prod",p,i);let s;if(e.shouldExecuteOnCPU([t])){let o=e.texData.get(t.dataId).values,{outVals:c,outShape:m,outDtype:u}=b(t.shape,t.dtype,o,p);s=e.makeTensorInfo(m,u,c)}else{let[o,c]=a.computeOutAndReduceShapes(t.shape,p),m=f.sizeFromShape(c),u=d({inputs:{x:t},backend:e,attrs:{shape:[-1,m]}}),I=P(n.dtype),l=T(u,I,"prod",e);s=d({inputs:{x:l},backend:e,attrs:{shape:o}}),r.push(u),r.push(l)}if(S){r.push(s);let o=a.expandShapeToKeepDim(s.shape,h);s=d({inputs:{x:s},backend:e,attrs:{shape:o}})}return r.forEach(o=>e.disposeIntermediateTensorInfo(o)),s}var N={kernelName:y,backendName:"webgl",kernelFunc:O};export{O as prod,N as prodConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Prod.js:
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
//# sourceMappingURL=Prod.js.map