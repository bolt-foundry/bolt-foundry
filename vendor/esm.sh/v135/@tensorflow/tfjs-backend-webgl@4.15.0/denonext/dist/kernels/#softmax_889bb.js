/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Softmax) denonext production */
import{backend_util as h,Softmax as l,util as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{exp as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Exp.js";import{max as T}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Max.js";import{realDiv as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/RealDiv.js";import{reshape as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{sub as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Sub.js";import{sum as S}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Sum.js";function E(x){let{inputs:c,backend:e,attrs:f}=x,{logits:s}=c,{dim:u}=f,t=b.parseAxisParam([u],s.shape),o=T({inputs:{x:s},backend:e,attrs:{reductionIndices:t,keepDims:!1}}),a=h.expandShapeToKeepDim(o.shape,t),i=d({inputs:{x:o},backend:e,attrs:{shape:a}}),r=D({inputs:{a:s,b:i},backend:e}),n=k({inputs:{x:r},backend:e}),p=S({inputs:{x:n},backend:e,attrs:{axis:t,keepDims:!1}}),m=d({inputs:{x:p},backend:e,attrs:{shape:a}}),I=g({inputs:{a:n,b:m},backend:e});return e.disposeIntermediateTensorInfo(o),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(r),e.disposeIntermediateTensorInfo(n),e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(m),I}var F={kernelName:l,backendName:"webgl",kernelFunc:E};export{E as softmax,F as softmaxConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Softmax.js:
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
//# sourceMappingURL=Softmax.js.map