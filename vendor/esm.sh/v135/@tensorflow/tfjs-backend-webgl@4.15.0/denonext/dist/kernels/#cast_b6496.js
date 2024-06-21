/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Cast) denonext production */
import*as u from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Cast as d,util as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{castImplCPU as I}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{complex as y}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Complex.js";import{identity as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";import{notEqual as x}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/NotEqual.js";import{real as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Real.js";import{int as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/int.js";function a(m){let{inputs:c,backend:t,attrs:l}=m,{x:e}=c,{dtype:r}=l;if(r==="complex64"){if(e.dtype==="complex64")return i({inputs:{x:e},backend:t});let o=u.zeros(e.shape),s=a({inputs:{x:e},backend:t,attrs:{dtype:"float32"}}),n=y({inputs:{real:s,imag:o},backend:t});return o.dispose(),t.disposeIntermediateTensorInfo(s),n}if(e.dtype==="complex64"){let o=T({inputs:{input:e},backend:t}),s=a({inputs:{x:o},backend:t,attrs:{dtype:r}});return t.disposeIntermediateTensorInfo(o),s}if(!p.hasEncodingLoss(e.dtype,r)){let o=i({inputs:{x:e},backend:t});return{dataId:o.dataId,shape:o.shape,dtype:r}}if(t.shouldExecuteOnCPU([e])){let o=t.texData.get(e.dataId).values,[s,n,f]=I(o,e.shape,e.dtype,r);return t.makeTensorInfo(s,n,f)}if(r==="int32")return b(e,t);if(r==="bool"){let o=t.makeTensorInfo([],"bool",p.getTypedArrayFromDType("bool",1)),n=x({inputs:{a:e,b:o},backend:t});return t.disposeIntermediateTensorInfo(o),n}throw new Error(`Error in Cast: failed to cast ${e.dtype} to ${r}`)}var D={kernelName:d,backendName:"webgl",kernelFunc:a};export{a as cast,D as castConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Cast.js:
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
//# sourceMappingURL=Cast.js.map