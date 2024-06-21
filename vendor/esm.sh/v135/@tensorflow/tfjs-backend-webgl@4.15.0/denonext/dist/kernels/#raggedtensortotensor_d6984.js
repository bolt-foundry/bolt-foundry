/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/RaggedTensorToTensor) denonext production */
import{RaggedTensorToTensor as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{raggedTensorToTensorImplCPU as y}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function I(s){let{inputs:d,backend:e,attrs:p}=s,{shape:n,values:a,defaultValue:t,rowPartitionTensors:r}=d,{rowPartitionTypes:c}=p,u=e.readSync(n.dataId),T=e.readSync(a.dataId),i=e.readSync(t.dataId),l=r.map(o=>e.readSync(o.dataId)),g=r.map(o=>o.shape),[m,h]=y(u,n.shape,T,a.shape,a.dtype,i,t.shape,l,g,c);return e.makeTensorInfo(m,a.dtype,h)}var w={kernelName:f,backendName:"webgl",kernelFunc:I};export{I as raggedTensorToTensor,w as raggedTensorToTensorConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedTensorToTensor.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=RaggedTensorToTensor.js.map