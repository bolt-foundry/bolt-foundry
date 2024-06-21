/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/StridedSlice) denonext production */
import{buffer as v,slice_util as d,StridedSlice as w,util as E}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{stridedSliceImplCPU as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{StridedSliceProgram as A}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/strided_slice_gpu.js";import{reshape as o}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{slice as N}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Slice.js";function z(c){let{inputs:u,backend:s,attrs:m}=c,{x:e}=u,{begin:f,end:h,strides:S,beginMask:g,endMask:k,ellipsisMask:x,newAxisMask:b,shrinkAxisMask:I}=m,{finalShapeSparse:l,finalShape:i,isIdentity:P,sliceDim0:y,isSimpleSlice:C,begin:r,end:M,strides:a}=d.sliceInfo(e.shape,f,h,S,g,k,x,b,I),t;if(P)t=o({inputs:{x:e},backend:s,attrs:{shape:i}});else if(y||C){E.assert(e.shape.length>=1,()=>`Input must have rank at least 1, got: ${e.shape.length}`);let p=d.computeOutShape(r,M,a),n=N({inputs:{x:e},backend:s,attrs:{begin:r,size:p}});t=o({inputs:{x:n},backend:s,attrs:{shape:i}}),s.disposeIntermediateTensorInfo(n)}else if(s.shouldExecuteOnCPU([e])){let n=s.readSync(e.dataId),U=v(e.shape,e.dtype,n),$=T(l,U,a,r);t=s.makeTensorInfo(i,e.dtype,$.values)}else{let n=new A(r,a,l);t=s.runWebGLProgram(n,[e],e.dtype)}let O=o({inputs:{x:t},backend:s,attrs:{shape:i}});return s.disposeIntermediateTensorInfo(t),O}var R={kernelName:w,backendName:"webgl",kernelFunc:z};export{z as stridedSlice,R as stridedSliceConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/StridedSlice.js:
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
//# sourceMappingURL=StridedSlice.js.map