/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Pack) denonext production */
import{Pack as f,util as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{concat as l}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Concat.js";import{expandDims as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/ExpandDims.js";function k(c){let{inputs:t,backend:e,attrs:i}=c,{axis:n}=i;if(t.length===1)return p({inputs:{input:t[0]},backend:e,attrs:{dim:n}});let d=t[0].shape,m=t[0].dtype;t.forEach(s=>{r.assertShapesMatch(d,s.shape,"All tensors passed to stack must have matching shapes"),r.assert(m===s.dtype,()=>"All tensors passed to stack must have matching dtypes")});let a=[],u=t.map(s=>{let o=p({inputs:{input:s},backend:e,attrs:{dim:n}});return a.push(o),o}),h=l({inputs:u,backend:e,attrs:{axis:n}});return a.forEach(s=>e.disposeIntermediateTensorInfo(s)),h}var T={kernelName:f,backendName:"webgl",kernelFunc:k};export{k as pack,T as packConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Pack.js:
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
//# sourceMappingURL=Pack.js.map