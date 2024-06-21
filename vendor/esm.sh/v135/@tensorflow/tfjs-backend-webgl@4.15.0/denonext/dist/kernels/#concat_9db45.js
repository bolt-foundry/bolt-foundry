/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Concat) denonext production */
import{backend_util as p,Concat as h,util as o}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{concatImpl as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Concat_impl.js";import{identity as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";function k(i){let{inputs:t,backend:n,attrs:c}=i,{axis:m}=c,a=o.parseAxisParam(m,t[0].shape)[0],u=t.map(e=>e.shape);p.assertParamsConsistent(u,a);let r=p.computeOutShape(t.map(e=>e.shape),a);if(o.sizeFromShape(r)===0)return n.makeTensorInfo(r,t[0].dtype,[]);let s=t.filter(e=>o.sizeFromShape(e.shape)>0);return s.length===1?l({inputs:{x:s[0]},backend:n}):f(s,a,n)}var S={kernelName:h,backendName:"webgl",kernelFunc:k};export{k as concat,S as concatConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Concat.js:
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
//# sourceMappingURL=Concat.js.map