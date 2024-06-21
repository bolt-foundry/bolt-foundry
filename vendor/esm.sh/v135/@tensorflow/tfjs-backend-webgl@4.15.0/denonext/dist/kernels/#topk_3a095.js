/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/TopK) denonext production */
import{env as F,TopK as V,util as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{topKImplCPU as z}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{MergeProgram as R,SwapProgram as G}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/top_k_gpu.js";import{fill as M}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Fill.js";import{gatherV2 as W}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/GatherV2.js";import{reshape as S}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{slice as Z}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Slice.js";function p(u,i){i!==null&&u.disposeIntermediateTensorInfo(i)}function v(u){let i=1;for(;i<u;)i*=2;return i}function Y(u){let{inputs:i,backend:t,attrs:E}=u,{x:r}=i,{k:l,sorted:L}=E,U=F().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),A=F().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),o=r.shape,c=o[o.length-1];if(t.shouldExecuteOnCPU([r])||c<U||l>A){let s=t.readSync(r.dataId),[a,n]=z(s,o,r.dtype,l,L);return[t.makeTensorInfo(a.shape,a.dtype,a.values),t.makeTensorInfo(n.shape,n.dtype,n.values)]}if(l===0)return o[o.length-1]=0,[t.makeTensorInfo(o,r.dtype,[]),t.makeTensorInfo(o,"int32",[])];if(c===1)return[r,M({attrs:{shape:o,dtype:"int32",value:0},backend:t})];let D=t.texData.get(r.dataId),k=D!==null&&D.isPacked,O=k?t.unpackTensor(r):r,d=y.sizeFromShape(o)/c,m=S({inputs:{x:O},attrs:{shape:[d,c]},backend:t});k&&p(t,O);let f=v(l),N=v(c),e=null,H=()=>e===null?[m,m]:[m,e],K=(s,a,n)=>{let b=H(),h=new G(n),I=[[c],[e===null?1:0],[Number.NEGATIVE_INFINITY],[s],[a]],x=e;e=t.runWebGLProgram(h,b,"int32",I),p(t,x)};for(let s=1;s<f;s*=2){let a=s*2;for(let n=s;n>=1;n/=2)K(a,n,[d,N])}for(let s=N;s>f;s/=2){let a=H(),n=new R([d,s/2]),h=[[c],[e===null?1:0],[f]],w=e;e=t.runWebGLProgram(n,a,"int32",h),p(t,w);let I=f/2,x=I*2;for(let g=I;g>=1;g/=2)K(x,g,e.shape)}let T=e;e=Z({inputs:{x:e},backend:t,attrs:{begin:0,size:[d,l]}}),p(t,T);let P=W({inputs:{x:m,indices:e},backend:t,attrs:{axis:1,batchDims:1}});p(t,m);let _=o.slice(0,-1);_.push(l),T=e,e=S({inputs:{x:e},attrs:{shape:_},backend:t}),p(t,T);let C=P;return P=S({inputs:{x:P},attrs:{shape:_},backend:t}),p(t,C),[P,e]}var et={kernelName:V,backendName:"webgl",kernelFunc:Y};export{Y as topK,et as topKConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/TopK.js:
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
//# sourceMappingURL=TopK.js.map