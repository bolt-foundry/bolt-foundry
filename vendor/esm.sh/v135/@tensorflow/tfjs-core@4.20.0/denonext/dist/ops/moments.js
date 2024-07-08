/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/moments) denonext production */
import{convertToTensor as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{parseAxisParam as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{expandShapeToKeepDim as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/axis_util.js";import{cast as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{mean as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mean.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";import{square as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/square.js";import{sub as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";function S(o,n=null,m=!1){o=f(o,"x","moments");let e=i(n,o.shape),r=a(o,e,m),t=r.shape;m||(t=c(r.shape,e));let p=d(v(h(o,"float32"),l(r,t))),s=a(p,e,m);return{mean:r,variance:s}}var g=u({moments_:S});export{g as moments};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/moments.js:
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
//# sourceMappingURL=moments.js.map