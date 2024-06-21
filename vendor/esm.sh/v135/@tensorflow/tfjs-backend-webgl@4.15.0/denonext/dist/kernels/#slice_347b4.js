/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Slice) denonext production */
import{env as g,Slice as I,slice_util as c,util as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{sliceImplCPU as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{SliceProgram as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/slice_gpu.js";import{SlicePackedProgram as C}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/slice_packed_gpu.js";function x(n,l,e,i){let t=i.texData.get(n.dataId),r=i.makeTensorInfo(e,n.dtype),o=i.texData.get(r.dataId);Object.assign(o,t),o.refCount=1,o.shape=e,o.dtype=n.dtype;let s=c.computeFlatOffset(l,f.computeStrides(n.shape));t.slice&&(s+=t.slice.flatOffset),o.slice={flatOffset:s,origDataId:t.slice&&t.slice.origDataId||n.dataId};let a=i.dataRefCount.get(o.slice.origDataId)||1;return i.dataRefCount.set(o.slice.origDataId,a+1),r}function S(n){let{inputs:l,backend:e,attrs:i}=n,{x:t}=l,{begin:r,size:o}=i,[s,a]=c.parseSliceParams(t,r,o);if(c.assertParamsValid(t,s,a),f.sizeFromShape(a)===0)return e.makeTensorInfo(a,t.dtype,[]);if(e.shouldExecuteOnCPU([t])||t.dtype==="string"){let d=e.texData.get(t.dataId),u=P(d.values,s,a,t.shape,t.dtype);return e.makeTensorInfo(a,t.dtype,u)}let{isPacked:p}=e.texData.get(t.dataId),m=c.isSliceContinous(t.shape,s,a);if(p||!m){let d=g().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new C(a):new D(a),u=[s];return e.runWebGLProgram(d,[t],t.dtype,u)}return e.uploadToGPU(t.dataId),x(t,s,a,e)}var k={kernelName:I,backendName:"webgl",kernelFunc:S};export{S as slice,k as sliceConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Slice.js:
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
//# sourceMappingURL=Slice.js.map