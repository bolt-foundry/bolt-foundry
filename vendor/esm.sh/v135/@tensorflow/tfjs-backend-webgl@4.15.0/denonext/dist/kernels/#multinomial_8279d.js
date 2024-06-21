/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Multinomial) denonext production */
import{Multinomial as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{MultinomialProgram as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/multinomial_gpu.js";import{softmax as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Softmax.js";function h(s){let{inputs:m,backend:t,attrs:r}=s,{logits:n}=m,{numSamples:i,seed:a,normalized:e}=r,o=e?n:b({inputs:{logits:n},backend:t,attrs:{dim:n.shape.length-1}}),c=o.shape[0],l=o.shape[1],u=new g(c,l,i),p=[[a]],f=t.runWebGLProgram(u,[o],"int32",p);return e||t.disposeIntermediateTensorInfo(o),f}var z={kernelName:d,backendName:"webgl",kernelFunc:h};export{h as multinomial,z as multinomialConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Multinomial.js:
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
//# sourceMappingURL=Multinomial.js.map