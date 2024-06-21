/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/spectral/rfft) denonext production */
import{assert as C}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{complex as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/complex.js";import{concat as j}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/concat.js";import{imag as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/imag.js";import{op as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{real as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/real.js";import{reshape as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{slice as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/slice.js";import{split as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/split.js";import{zeros as V}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/zeros.js";import{zerosLike as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/zeros_like.js";import{fft as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/spectral/fft.js";function M(o,s){C(o.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${o.dtype}`);let e=o.shape[o.shape.length-1],z=o.size/e,r;if(s!=null&&s<e){let m=o.shape.map(n=>0),t=o.shape.map(n=>n);t[o.shape.length-1]=s,r=v(o,m,t),e=s}else if(s!=null&&s>e){let m=o.shape.map(t=>t);m[o.shape.length-1]=s-e,r=j([o,V(m)],o.shape.length-1),e=s}else r=o;let d=k(r),x=f(i(r,d),[z,e]),l=D(x),a=Math.floor(e/2)+1,p=S(l),c=y(l),b=g(p,[a,e-a],p.shape.length-1),u=g(c,[a,e-a],c.shape.length-1),h=r.shape.slice();return h[r.shape.length-1]=a,f(i(b[0],u[0]),h)}var K=I({rfft_:M});export{K as rfft};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/spectral/rfft.js:
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
//# sourceMappingURL=rfft.js.map