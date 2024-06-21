/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Reshape) denonext production */
import{Reshape as l,util as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{packedReshape as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/reshape.js";import{isReshapeFree as o}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl_util.js";function f(r){let{inputs:d,backend:c,attrs:i}=r,{x:e}=d,{shape:m}=i,s=c,n=t.sizeFromShape(e.shape),a=t.inferFromImplicitShape(m,n),h=t.sizeFromShape(a);t.assert(n===h,()=>`The new shape (${a}) has ${h} elements and the old shape (${e.shape}) has ${n} elements. The new shape and old shape must have the same number of elements.`);let p=s.texData.get(e.dataId);return p.isPacked&&!o(e.shape,a)&&!(p.texture!==null&&o(p.shape,a))?u(e,a,s):(s.incRef(e.dataId),{dataId:e.dataId,shape:a,dtype:e.dtype})}var b={kernelName:l,backendName:"webgl",kernelFunc:f};export{f as reshape,b as reshapeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Reshape.js:
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
//# sourceMappingURL=Reshape.js.map