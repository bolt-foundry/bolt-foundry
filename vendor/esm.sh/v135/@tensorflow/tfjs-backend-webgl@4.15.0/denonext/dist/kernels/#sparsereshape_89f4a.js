/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/SparseReshape) denonext production */
import{SparseReshape as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{sparseReshapeImplCPU as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function I(p){let{inputs:s,backend:a}=p,{inputIndices:e,inputShape:n,newShape:r}=s;if(e.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape ${e.shape}`);if(n.shape.length!==1)throw new Error(`Input shape should be a vector but received shape ${n.shape}`);if(r.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${r.shape}`);let o=Array.from(a.readSync(n.dataId)),h=a.readSync(e.dataId),d=Array.from(a.readSync(r.dataId)),[c,i,t]=m(h,e.shape,e.dtype,o,d);return[a.makeTensorInfo(i,e.dtype,c),a.makeTensorInfo([t.length],r.dtype,new Int32Array(t))]}var w={kernelName:u,backendName:"webgl",kernelFunc:I};export{I as sparseReshape,w as sparseReshapeConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseReshape.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=SparseReshape.js.map