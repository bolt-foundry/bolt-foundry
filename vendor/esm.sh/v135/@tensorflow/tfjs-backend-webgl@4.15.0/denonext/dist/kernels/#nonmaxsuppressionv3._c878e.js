/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/NonMaxSuppressionV3) denonext production */
import{backend_util as u,kernel_impls as x,NonMaxSuppressionV3 as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var m=x.nonMaxSuppressionV3Impl;function k(s){u.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:o,backend:n,attrs:t}=s,{boxes:r,scores:a}=o,{maxOutputSize:c,iouThreshold:p,scoreThreshold:i}=t,l=n.readSync(r.dataId),d=n.readSync(a.dataId),{selectedIndices:e}=m(l,d,c,p,i);return n.makeTensorInfo([e.length],"int32",new Int32Array(e))}var b={kernelName:S,backendName:"webgl",kernelFunc:k};export{k as nonMaxSuppressionV3,b as nonMaxSuppressionV3Config};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV3.js:
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
//# sourceMappingURL=NonMaxSuppressionV3.js.map