/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/batchnorm) denonext production */
import{ENGINE as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{FusedBatchNorm as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as o from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{xAs4D as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/batchnorm_util.js";import{op as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as q}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function v(l,u,f,s,m,e){e==null&&(e=.001);let i=a(l,"x","batchNorm"),r=a(u,"mean","batchNorm"),c=a(f,"variance","batchNorm"),t;m!=null&&(t=a(m,"scale","batchNorm"));let n;s!=null&&(n=a(s,"offset","batchNorm")),o.assert(r.rank===c.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),o.assert(n==null||r.rank===n.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),o.assert(t==null||r.rank===t.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let h={x:d(i),scale:t,offset:n,mean:r,variance:c},p={varianceEpsilon:e},N=k.runKernel(b,h,p);return q(N,i.shape)}var F=x({batchNorm_:v});export{F as batchNorm};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/batchnorm.js:
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
//# sourceMappingURL=batchnorm.js.map