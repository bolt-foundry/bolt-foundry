/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Cum_impl) denonext production */
import{backend_util as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{CumProgram as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/cum_gpu.js";import{identity as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Identity.js";import{transpose as d}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";function y(u,n,e,a,l,f){let p=n.shape.length,i=m.getAxesPermutation([a],p),s=n;i!=null&&(s=d({inputs:{x:n},backend:e,attrs:{perm:i}}));let g=m.getInnerMostAxes(1,p)[0];if(g!==p-1)throw new Error(`WebGL cumprod shader expects an inner-most axis=${n.shape.length-1} but got axis=${a}`);let I=s.shape[g],t=P({inputs:{x:s},backend:e});for(let r=0;r<=Math.ceil(Math.log2(I))-1;r++){let o=new h(u,s.shape,!1,f),c=[[r]],x=t;t=e.runWebGLProgram(o,[t],t.dtype,c),e.disposeIntermediateTensorInfo(x)}if(l){let r=new h(u,s.shape,l,f),o=t;t=e.runWebGLProgram(r,[t],t.dtype),e.disposeIntermediateTensorInfo(o)}if(i!=null){let r=m.getUndoAxesPermutation(i),o=d({inputs:{x:t},backend:e,attrs:{perm:r}});return e.disposeIntermediateTensorInfo(t),e.disposeIntermediateTensorInfo(s),o}return t}export{y as cumImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Cum_impl.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=Cum_impl.js.map