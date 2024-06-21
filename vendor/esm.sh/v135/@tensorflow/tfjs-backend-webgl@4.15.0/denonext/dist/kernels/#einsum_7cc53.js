/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Einsum) denonext production */
import{backend_util as o,Einsum as T,util as q}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{multiply as y}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Multiply.js";import{reshape as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{sum as S}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Sum.js";import{transpose as C}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function N(x){let{inputs:D,backend:n,attrs:E}=x,{equation:b}=E,m=D,{allDims:r,summedDims:I,idDims:u}=o.decodeEinsumEquation(b,m.length);o.checkEinsumDimSizes(r.length,u,m);let{path:f,steps:h}=o.getEinsumComputePath(I,u),d=h.length,t=null,p=r.length,i=[];for(let s=0;s<d;++s){for(let a of h[s]){let{permutationIndices:g,expandDims:k}=o.getEinsumPermutation(p,u[a]),e;o.isIdentityPermutation(g)?e=m[a]:(e=C({inputs:{x:m[a]},backend:n,attrs:{perm:g}}),i.push(e));let l=e.shape.slice();for(let c=0;c<k.length;++c)l.splice(k[c],0,1);q.arraysEqual(e.shape,l)||(e=P({inputs:{x:e},backend:n,attrs:{shape:l}}),i.push(e)),t===null?t=e:(t=y({inputs:{a:e,b:t},backend:n}),i.push(t))}s<d-1&&(f[s]>=0&&(t=S({inputs:{x:t},backend:n,attrs:{axis:f[s]-(r.length-p),keepDims:!1}}),i.push(t)),p--)}for(let s of i)s!==t&&n.disposeIntermediateTensorInfo(s);return t}var j={kernelName:T,backendName:"webgl",kernelFunc:N};export{N as einsum,j as einsumConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Einsum.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=Einsum.js.map