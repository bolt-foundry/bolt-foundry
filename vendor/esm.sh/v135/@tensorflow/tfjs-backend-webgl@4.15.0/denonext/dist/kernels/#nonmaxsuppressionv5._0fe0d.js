/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/NonMaxSuppressionV5) denonext production */
import{backend_util as f,kernel_impls as k,NonMaxSuppressionV5 as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";var b=k.nonMaxSuppressionV5Impl;function g(o){f.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:n,attrs:a}=o,{boxes:r,scores:c}=t,{maxOutputSize:l,iouThreshold:i,scoreThreshold:p,softNmsSigma:d}=a,u=n.readSync(r.dataId),m=n.readSync(c.dataId),S=l,x=i,h=p,V=d,{selectedIndices:e,selectedScores:s}=b(u,m,S,x,h,V);return[n.makeTensorInfo([e.length],"int32",new Int32Array(e)),n.makeTensorInfo([s.length],"float32",new Float32Array(s))]}var T={kernelName:I,backendName:"webgl",kernelFunc:g};export{g as nonMaxSuppressionV5,T as nonMaxSuppressionV5Config};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/NonMaxSuppressionV5.js:
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
//# sourceMappingURL=NonMaxSuppressionV5.js.map