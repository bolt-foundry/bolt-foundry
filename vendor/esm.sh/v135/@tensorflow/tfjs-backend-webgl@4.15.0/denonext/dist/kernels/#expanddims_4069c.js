/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ExpandDims) denonext production */
import{ExpandDims as c,util as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reshape as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function u(a){let{inputs:p,attrs:r,backend:o}=a,{dim:e}=r,{input:t}=p,n=t.shape.length,s=t.shape.slice(),i=e;return e<0&&(m.assert(-(n+1)<=e,()=>`Axis must be in the interval [${-(n+1)}, ${n}]`),i=n+e+1),s.splice(i,0,1),l({inputs:{x:t},backend:o,attrs:{shape:s}})}var x={kernelName:c,backendName:"webgl",kernelFunc:u};export{u as expandDims,x as expandDimsConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ExpandDims.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=ExpandDims.js.map