/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/spectral/irfft) denonext production */
import{complex as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/complex.js";import{concat as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/concat.js";import{imag as j}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/imag.js";import{mul as z}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{op as C}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{real as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/real.js";import{reshape as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{reverse as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reverse.js";import{scalar as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/scalar.js";import{slice as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/slice.js";import{ifft as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/spectral/ifft.js";function d(r){let t=r.shape[r.shape.length-1],e=r.size/t,o;if(t<=2){let m=c(r,[e,t]);o=l(m)}else{let m=[e,2*(t-1)],s=c(n(r),[e,t]),p=c(j(r),[e,t]),h=f(i(s,[0,1],[e,t-2]),1),g=z(f(i(p,[0,1],[e,t-2]),1),S(-1)),x=a([s,h],1),I=a([p,g],1),u=c(b(x,I),[m[0],m[1]]);o=l(u)}if(o=n(o),r.rank===3&&r.shape[0]!==0){let m=o,s=r.shape[0];o=c(o,[s,o.shape[0]/s,o.shape[1]]),m.dispose()}return o}var G=C({irfft_:d});export{G as irfft};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/spectral/irfft.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=irfft.js.map