/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/GatherV2) denonext production */
import{backend_util as G,GatherV2 as V,util as u,env as P}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{GatherProgram as B}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/gather_gpu.js";import{gatherV2ImplCPU as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{reshape as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function E(x){let{inputs:b,backend:t,attrs:g}=x,{x:s,indices:o}=b,{axis:z,batchDims:I}=g,d=u.parseAxisParam(z,s.shape)[0];if(P().get("DEBUG")){let n=t.readSync(o.dataId),p=s.shape[d];for(let a=0;a<n.length;++a){let c=n[a];u.assert(c<=p-1&&c>=0,()=>`GatherV2: the index value ${c} is not in [0, ${p-1}]`)}}let e=G.segment_util.collectGatherOpShapeInfo(s,o,d,I),m=u.sizeFromShape(o.shape),r=[],i=f({inputs:{x:s},backend:t,attrs:{shape:[e.batchSize,e.outerSize,e.dimSize,e.sliceSize]}}),h=f({inputs:{x:o},backend:t,attrs:{shape:[e.batchSize,m/e.batchSize]}});r.push(i),r.push(h);let l=[e.batchSize,e.outerSize,m/e.batchSize,e.sliceSize];if(t.shouldExecuteOnCPU([s,o])||s.dtype==="string"){let n=t.bufferSync(h),p=t.bufferSync(i),a=D(p,n,l);return r.forEach(c=>t.disposeIntermediateTensorInfo(c)),t.makeTensorInfo(e.outputShape,a.dtype,a.values)}let k=new B(i.shape,l),S=t.runWebGLProgram(k,[i,h],i.dtype);r.push(S);let y=f({inputs:{x:S},backend:t,attrs:{shape:e.outputShape}});return r.forEach(n=>t.disposeIntermediateTensorInfo(n)),y}var U={kernelName:V,backendName:"webgl",kernelFunc:E};export{E as gatherV2,U as gatherV2Config};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/GatherV2.js:
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
//# sourceMappingURL=GatherV2.js.map