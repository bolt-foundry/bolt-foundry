/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Mean_impl) denonext production */
import{util as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reduce as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/reduce.js";import{reshape as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function S(t,n,m,e){let s=p.sizeFromShape(n),a=p.sizeFromShape(t.shape)/s,o=i({inputs:{x:t},attrs:{shape:[a,s]},backend:e}),r=h(o,"float32","mean",e),u=i({inputs:{x:r},attrs:{shape:m},backend:e});return e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(r),u}export{S as meanImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Mean_impl.js:
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
//# sourceMappingURL=Mean_impl.js.map