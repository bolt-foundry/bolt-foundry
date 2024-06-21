/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ArgMin) denonext production */
import{ArgMin as u,backend_util as r,util as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{argMinMaxReduce as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/arg_min_max.js";import{transpose as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function d(i){let{inputs:p,backend:s,attrs:m}=i,{x:t}=p,{axis:c}=m,e=x.parseAxisParam(c,t.shape),o=r.getAxesPermutation(e,t.shape.length),n=t,a=[];o!=null&&(n=f({inputs:{x:t},backend:s,attrs:{perm:o}}),a.push(n),e=r.getInnerMostAxes(e.length,n.shape.length)),r.assertAxesAreInnerMostDims("argMin",[e[0]],n.shape.length);let g=h(s,n,e[0],"min");return a.forEach(l=>s.disposeIntermediateTensorInfo(l)),g}var I={kernelName:u,backendName:"webgl",kernelFunc:d};export{d as argMin,I as argMinConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ArgMin.js:
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
//# sourceMappingURL=ArgMin.js.map