/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Unpack) denonext production */
import{Unpack as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{reshape as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{slice as w}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Slice.js";function y(u){let{inputs:f,backend:s,attrs:m}=u,{value:o}=f,{axis:n}=m;n<0&&(n+=o.shape.length);let t=o,r=t.shape.length,k=o.shape[n],c=new Array(r-1),d=0;for(let e=0;e<r;e++)e!==n&&(c[d++]=t.shape[e]);let p=[],i=new Array(r).fill(0),l=t.shape.slice();l[n]=1;let a=new Array(k);for(let e=0;e<a.length;e++){i[n]=e;let h=w({inputs:{x:t},backend:s,attrs:{begin:i,size:l}}),x=b({inputs:{x:h},backend:s,attrs:{shape:c}});a[e]=x,p.push(h)}return p.forEach(e=>s.disposeIntermediateTensorInfo(e)),a}var v={kernelName:g,backendName:"webgl",kernelFunc:y};export{y as unpack,v as unpackConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Unpack.js:
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
//# sourceMappingURL=Unpack.js.map