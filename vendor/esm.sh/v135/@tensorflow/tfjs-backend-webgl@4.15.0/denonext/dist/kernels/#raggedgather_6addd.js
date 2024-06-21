/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/RaggedGather) denonext production */
import{RaggedGather as N}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{raggedGatherImplCPU as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";function I(o){let{inputs:p,backend:t,attrs:r}=o,{paramsNestedSplits:s,paramsDenseValues:a,indices:n}=p,{outputRaggedRank:d}=r,c=s.map(e=>t.readSync(e.dataId)),u=s.map(e=>e.shape),m=t.readSync(a.dataId),i=t.readSync(n.dataId),[l,g,h]=f(c,u,m,a.shape,a.dtype,i,n.shape,d),S=l.map(e=>t.makeTensorInfo([e.length],"int32",e)),k=t.makeTensorInfo(h,a.dtype,g);return S.concat([k])}var V={kernelName:N,backendName:"webgl",kernelFunc:I};export{I as raggedGather,V as raggedGatherConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/RaggedGather.js:
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
//# sourceMappingURL=RaggedGather.js.map