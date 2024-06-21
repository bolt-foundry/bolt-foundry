/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/SplitV) denonext production */
import{backend_util as k,SplitV as z,util as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{slice as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Slice.js";function g(r){let{inputs:c,backend:a,attrs:o}=r,{x:e}=c,{numOrSizeSplits:p,axis:l}=o,t=b.parseAxisParam(l,e.shape)[0],m=k.prepareSplitSize(e,p,t),u=e.shape.length,s=new Array(u).fill(0),x=e.shape.slice();return m.map(i=>{let n=[...x];n[t]=i;let S=f({inputs:{x:e},backend:a,attrs:{begin:s,size:n}});return s[t]+=i,S})}var V={kernelName:z,backendName:"webgl",kernelFunc:g};export{g as splitV,V as splitVConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/SplitV.js:
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
//# sourceMappingURL=SplitV.js.map