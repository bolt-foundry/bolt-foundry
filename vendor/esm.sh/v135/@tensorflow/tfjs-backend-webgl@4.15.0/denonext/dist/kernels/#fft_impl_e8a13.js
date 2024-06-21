/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/FFT_impl) denonext production */
import{util as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{FFTProgram as I}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/fft_gpu.js";import{complex as x}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Complex.js";import{reshape as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function z(e,r,t){let o=t.texData.get(e.dataId),h=T.sizeFromShape(e.shape),a=e.shape[e.shape.length-1],u=h/a,p=f({inputs:{x:e},backend:t,attrs:{shape:[u,a]}}),s=p.shape,d=new I("real",s,r),c=new I("imag",s,r),n=[{dataId:o.complexTensorInfos.real.dataId,dtype:o.complexTensorInfos.real.dtype,shape:s},{dataId:o.complexTensorInfos.imag.dataId,dtype:o.complexTensorInfos.imag.dtype,shape:s}],m=t.runWebGLProgram(d,n,"float32"),i=t.runWebGLProgram(c,n,"float32"),l=x({inputs:{real:m,imag:i},backend:t});t.disposeIntermediateTensorInfo(m),t.disposeIntermediateTensorInfo(i);let g=f({inputs:{x:l},backend:t,attrs:{shape:e.shape}});return t.disposeIntermediateTensorInfo(p),t.disposeIntermediateTensorInfo(l),g}export{z as fftImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/FFT_impl.js:
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
//# sourceMappingURL=FFT_impl.js.map