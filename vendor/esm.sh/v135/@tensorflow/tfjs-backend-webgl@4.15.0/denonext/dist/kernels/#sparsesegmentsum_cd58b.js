/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/SparseSegmentSum) denonext production */
import{SparseSegmentSum as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{sparseSegmentReductionImplCPU as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function u(s){let{inputs:r,backend:t}=s,{data:e,indices:a,segmentIds:n}=r;if(e.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(a.shape.length!==1)throw new Error(`Indices should be a vector but received shape
             ${a.shape}`);if(n.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
             ${n.shape}`);let o=t.readSync(e.dataId),d=t.readSync(a.dataId),c=t.readSync(n.dataId),[p,i]=h(o,e.shape,e.dtype,d,c);return t.makeTensorInfo(i,e.dtype,p)}var g={kernelName:m,backendName:"webgl",kernelFunc:u};export{u as sparseSegmentSum,g as sparseSegmentSumConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/SparseSegmentSum.js:
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
//# sourceMappingURL=SparseSegmentSum.js.map