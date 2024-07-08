/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/norm) denonext production */
import{convertToTensor as y}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{parseAxisParam as w}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{abs as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/abs.js";import*as a from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/axis_util.js";import{max as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/max.js";import{min as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/min.js";import{op as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{pow as E}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/pow.js";import{reshape as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";import{scalar as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/scalar.js";import{sqrt as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sqrt.js";import{square as A}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/square.js";import{sum as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sum.js";function I(n,o="euclidean",r=null,c=!1){n=y(n,"x","norm");let m=h(n,o,r),f=m.shape;if(c){let d=w(r,n.shape);f=a.expandShapeToKeepDim(m.shape,d)}return p(m,f)}function h(n,o,r=null){if(n.rank===0)return e(n);if(n.rank!==1&&r===null)return h(p(n,[-1]),o,r);if(n.rank===1||typeof r=="number"||Array.isArray(r)&&r.length===1){if(o===1)return t(e(n),r);if(o===1/0)return i(e(n),r);if(o===-1/0)return u(e(n),r);if(o==="euclidean"||o===2)return l(t(E(e(n),s(2,"int32")),r));throw new Error(`Error in norm: invalid ord value: ${o}`)}if(Array.isArray(r)&&r.length===2){if(o===1)return i(t(e(n),r[0]),r[1]-1);if(o===1/0)return i(t(e(n),r[1]),r[0]);if(o===-1/0)return u(t(e(n),r[1]),r[0]);if(o==="fro"||o==="euclidean")return l(t(A(n),r));throw new Error(`Error in norm: invalid ord value: ${o}`)}throw new Error(`Error in norm: invalid axis: ${r}`)}var z=v({norm_:I});export{z as norm};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/norm.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=norm.js.map