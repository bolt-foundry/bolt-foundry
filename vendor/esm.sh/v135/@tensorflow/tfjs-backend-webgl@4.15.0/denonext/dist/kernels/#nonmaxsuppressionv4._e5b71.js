/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/NonMaxSuppressionV4) denonext production */
import{backend_util as S,kernel_impls as m,NonMaxSuppressionV4 as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var k=m.nonMaxSuppressionV4Impl;function M(s){S.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:o,backend:n,attrs:t}=s,{boxes:a,scores:r}=o,{maxOutputSize:p,iouThreshold:c,scoreThreshold:i,padToMaxOutputSize:l}=t,u=n.readSync(a.dataId),d=n.readSync(r.dataId),{selectedIndices:e,validOutputs:x}=k(u,d,p,c,i,l);return[n.makeTensorInfo([e.length],"int32",new Int32Array(e)),n.makeTensorInfo([],"int32",new Int32Array([x]))]}var f={kernelName:I,backendName:"webgl",kernelFunc:M};export{M as nonMaxSuppressionV4,f as nonMaxSuppressionV4Config};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV4.js:
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
//# sourceMappingURL=NonMaxSuppressionV4.js.map