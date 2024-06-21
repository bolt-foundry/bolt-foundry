/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/SpaceToBatchND) denonext production */
import{backend_util as d,SpaceToBatchND as N,util as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{padV2 as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/PadV2.js";import{reshape as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{transpose as B}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";var S=l=>{let{inputs:m,backend:t,attrs:f}=l,{x:p}=m,{blockShape:s,paddings:g}=f;T.assert(p.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");let r=s.reduce((e,x)=>e*x),o=[[0,0]];o.push(...g);for(let e=1+s.length;e<p.shape.length;++e)o.push([0,0]);let a=[],n=D({inputs:{x:p},backend:t,attrs:{paddings:o,constantValue:0}}),c=d.getReshaped(n.shape,s,r,!1),k=d.getPermuted(c.length,s.length,!1),b=d.getReshapedPermuted(n.shape,s,r,!1),h=u({inputs:{x:n},backend:t,attrs:{shape:c}}),i=B({inputs:{x:h},backend:t,attrs:{perm:k}}),P=u({inputs:{x:i},backend:t,attrs:{shape:b}});return a.push(n),a.push(h),a.push(i),a.forEach(e=>t.disposeIntermediateTensorInfo(e)),P},V={kernelName:N,backendName:"webgl",kernelFunc:S};export{S as spaceToBatchND,V as spaceToBatchNDConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/SpaceToBatchND.js:
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
//# sourceMappingURL=SpaceToBatchND.js.map