/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ArgMax) denonext production */
import{ArgMax as l,backend_util as r,util as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{argMinMaxReduce as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/arg_min_max.js";import{transpose as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function d(i){let{inputs:p,backend:s,attrs:x}=i,{x:n}=p,{axis:m}=x,e=u.parseAxisParam(m,n.shape),a=r.getAxesPermutation(e,n.shape.length),t=n,o=[];a!=null&&(t=f({inputs:{x:n},backend:s,attrs:{perm:a}}),o.push(t),e=r.getInnerMostAxes(e.length,t.shape.length)),r.assertAxesAreInnerMostDims("argMax",[e[0]],t.shape.length);let c=h(s,t,e[0],"max");return o.forEach(g=>s.disposeIntermediateTensorInfo(g)),c}var I={kernelName:l,backendName:"webgl",kernelFunc:d};export{d as argMax,I as argMaxConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ArgMax.js:
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
//# sourceMappingURL=ArgMax.js.map