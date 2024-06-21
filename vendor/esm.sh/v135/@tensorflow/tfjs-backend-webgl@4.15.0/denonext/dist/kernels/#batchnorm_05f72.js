/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/BatchNorm) denonext production */
import{env as g,FusedBatchNorm as f,util as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{BatchNormProgram as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/batchnorm_gpu.js";import{BatchNormPackedProgram as N}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/batchnorm_packed_gpu.js";var B=({inputs:i,backend:u,attrs:m})=>{let{x:o,mean:e,variance:t,offset:a,scale:n}=i;p.assert(e.shape.length===t.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),p.assert(a==null||e.shape.length===a.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),p.assert(n==null||e.shape.length===n.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:r}=m;r==null&&(r=.001);let s=[o,e,t],l=null;a!=null&&(l=a.shape,s.push(a));let h=null;n!=null&&(h=n.shape,s.push(n));let c=g().getBool("WEBGL_PACK_NORMALIZATION")?new N(o.shape,e.shape,t.shape,l,h,r):new d(o.shape,e.shape,t.shape,l,h,r);return u.runWebGLProgram(c,s,s[0].dtype)},P={kernelName:f,backendName:"webgl",kernelFunc:B};export{B as batchNorm,P as batchNormConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchNorm.js:
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
//# sourceMappingURL=BatchNorm.js.map