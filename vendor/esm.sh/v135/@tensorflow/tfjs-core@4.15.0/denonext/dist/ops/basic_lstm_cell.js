/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/basic_lstm_cell) denonext production */
import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{add as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/add.js";import{concat as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/concat.js";import{matMul as H}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mat_mul.js";import{mul as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{op as _}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{sigmoid as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sigmoid.js";import{slice as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/slice.js";import{tanh as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/tanh.js";function k(a,f,p,b,C,S){let T=t(a,"forgetBias","basicLSTMCell"),M=t(f,"lstmKernel","basicLSTMCell"),L=t(p,"lstmBias","basicLSTMCell"),d=t(b,"data","basicLSTMCell"),h=t(C,"c","basicLSTMCell"),$=t(S,"h","basicLSTMCell"),g=x([d,$],1),u=H(g,M),o=e(u,L),B=o.shape[0],s=o.shape[1]/4,c=[B,s],w=i(o,[0,0],c),z=i(o,[0,s],c),K=i(o,[0,s*2],c),j=i(o,[0,s*3],c),r=e(n(l(w),m(z)),n(h,l(e(T,K)))),v=n(m(r),l(j));return[r,v]}var N=_({basicLSTMCell_:k});export{N as basicLSTMCell};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/basic_lstm_cell.js:
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
//# sourceMappingURL=basic_lstm_cell.js.map