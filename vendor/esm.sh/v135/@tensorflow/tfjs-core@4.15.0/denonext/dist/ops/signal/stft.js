/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/signal/stft) denonext production */
import{mul as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{op as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{enclosingPowerOfTwo as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/signal_ops_util.js";import{rfft as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/spectral/rfft.js";import{frame as w}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/signal/frame.js";import{hannWindow as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/signal/hann_window.js";function u(i,o,m,r,n=d){r==null&&(r=s(o));let t=w(i,o,m),f=p(t,n(o));return c(f,r)}var T=l({stft_:u});export{T as stft};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/signal/stft.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=stft.js.map