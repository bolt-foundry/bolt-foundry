/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/UnsortedSegmentSum) denonext production */
import{backend_util as r,sumOutType as E,UnsortedSegmentSum as M,util as W}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{SegmentOpProgram as X}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/segment_gpu.js";import{range as j}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Range.js";import{reshape as z}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{tile as q}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Tile.js";import{transpose as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function v(w){let{inputs:A,backend:t,attrs:C}=w,{x:p,segmentIds:D}=A,{numSegments:l}=C,h=p.shape.length,e=[],u=0,a=r.getAxesPermutation([u],h),n=p;a!=null&&(n=b({inputs:{x:p},backend:t,attrs:{perm:a}}),e.push(n),u=r.getInnerMostAxes(1,h)[0]);let P=r.segment_util.computeOutShape(n.shape,u,l),R=W.sizeFromShape([n.shape[u]]),g=z({inputs:{x:n},backend:t,attrs:{shape:[-1,R]}});e.push(g);let _=E(p.dtype),d=(s,S,F,x,o)=>{let N=s.shape[0],c=s.shape[1],I=r.segment_util.segOpComputeOptimalWindowSize(c,o),T={windowSize:I,inSize:c,batchSize:N,numSegments:o},U=new X(T,S),i=t.compileAndRun(U,[s,F],x);if(e.push(i),i.shape[1]===o)return i;let O=j({backend:t,attrs:{start:0,stop:o,step:1,dtype:"float32"}}),k=q({inputs:{x:O},backend:t,attrs:{reps:[c/I]}});return e.push(O),e.push(k),d(i,S,k,x,o)},y=d(g,"unsortedSegmentSum",D,_,l),f=z({inputs:{x:y},backend:t,attrs:{shape:P}}),m=f;if(a!=null){e.push(f);let s=r.getUndoAxesPermutation(a);m=b({inputs:{x:m},backend:t,attrs:{perm:s}})}return e.forEach(s=>t.disposeIntermediateTensorInfo(s)),m}var V={kernelName:M,backendName:"webgl",kernelFunc:v};export{v as unsortedSegmentSum,V as unsortedSegmentSumConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/UnsortedSegmentSum.js:
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
//# sourceMappingURL=UnsortedSegmentSum.js.map